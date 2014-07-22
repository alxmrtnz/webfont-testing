
'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var es = require( 'event-stream' );
var response = require( './response' );
var port = null;


module.exports = {

  configure: function( settings ) {
    port = settings.portNumber || 3001;
  },

  getAssets: function( req, res ) {
    var filePath = path.join( './dist/', req.url );
    response.streamPath( req, res, filePath );
  },

  getPartials: function( req, res ) {
    var filePath = path.join( './dist/pages', req.url );
    response.streamPath( req, res, filePath );
  },

  getDevResources: function( req, res ) {
    var filepath = path.join( '.', req.url );
    res.type( 'application/javascript' );

    // inject port number
    fs.createReadStream( filepath )
      .pipe(es.map(function(data, callback){
        var file = data.toString().replace( '{{ port }}', port );
        return callback( null, new Buffer( file, 'utf8' ) );
      }))
      .pipe( res );
  },

  getIndex: function( req, res ) {
    var filePath = path.resolve( './dist/pages/index.html' );
    response.stream( res, filePath );
  },

  getData: function( req, res ) {
    var filePath = path.resolve( '../data/data.json' );
    response.streamPath( req, res, filePath );
  }

};