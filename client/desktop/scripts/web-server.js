
'use strict';

var http = require( 'http' );
var fs = require( 'fs' );
var express = require( 'express' );
var app = express();
var routes = require( './routes' );
var skelErrors = require( './skelErrors' );
var livereload = require( './livereload' );
var server = http.createServer( app );
var domain = require( 'domain' );
var ngRoute = require( 'ng-route-it' );
var settings = JSON.parse( fs.readFileSync( '../../shared-settings.json' ).toString() ).local;
var port = settings.portNumber || 3001;

routes.configure( settings );

ngRoute.configure( [ '/view1', '/view2' ] ).setPrefixHash( '!' );

// middleware for handline uncaught errors - prevents
// random crashes
app.use( skelErrors );
app.use( ngRoute.route );

// using sockets for livereload stuff
livereload( server );

// routes for getting local assets, partials etc
app.route( '/assets/*' ).get( routes.getAssets );

app.route( '/dev/*' ).get( routes.getDevResources );

app.route( '/' ).get( routes.getIndex );

app.route( '/partials/*' ).get( routes.getPartials );

app.route('/data').get( routes.getData );

server.listen( port );

console.log( 'Listening on port ' + port );
