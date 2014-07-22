
'use strict';

var domain = require( 'domain' );

module.exports = function( req, res, next ) {
  var d = domain.create();

  d.on('error', function(err){
    res.status( 500 );
    res.end( err.message );
  });

  d.run( next );
};