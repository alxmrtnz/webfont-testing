
'use strict';

var fs = require( 'fs' );
var mimes = require( './mimes' );

function streamPath( req, res, filePath ) {
  var mime = mimes.getMimeType( req.url );

  fs.exists( filePath, function(exists){
    if ( exists ) {
      if ( mime ) {
        res.type( mime );
      }
      fs.createReadStream( filePath ).pipe( res );
    } else {
      console.log( '\n Resource ' + filePath + ' not found\n' );
      res.status( 404 );
      res.end();
    }
  });

}

function stream ( res, filePath ) {
  fs.createReadStream( filePath ).pipe( res );
}

exports.streamPath = streamPath;
exports.stream = stream;