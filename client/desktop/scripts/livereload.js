
'use strict';

var gaze = require( 'gaze' );
var domain = require( 'domain' );

module.exports = function( server ) {

  var d = domain.create();

  d.on('error', function(err){
    console.error( err.message );
  });

  d.run(function(){
    var io = require( 'socket.io' ).listen( server );

    io.sockets.on('connection', function( socket ){
      // by default, livereload watches all js, css, html
      var filesToWatch = [
        './dist/**/*.css',
        './dist/**/*.js',
        './dist/**/*.html'
      ];

      gaze(filesToWatch, function( err, watcher ){
        this.on('changed', function( filepath ) {
          socket.emit( 'refresh' );
        });
      });
    });
  });
};