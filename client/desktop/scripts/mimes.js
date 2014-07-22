
(function(){

  'use strict';

  var mimes = [
    {
      patt: '.\.css$',
      res: 'text/css'
    },
    {
      patt: '.\.js$',
      res: 'application/javascript'
    },
    {
      patt: '.\.svg$',
      res: 'image/svg+xml'
    },
    {
      patt: '.\.html$',
      res: 'text/html'
    },
    {
      patt: '.\.jpg$',
      res: 'image/jpeg'
    },
    {
      patt: '.\.png$',
      res: 'image/png'
    },
    {
      patt: '.\.mp3$',
      res: 'audio/mpeg3'
    }
  ];

  exports.getMimeType = function( url ) {
    var index = 0;

    while( index < mimes.length ) {
      if ( url.match( mimes[ index ].patt ) ) {
        return mimes[ index ].res;
      }
      index += 1;
    }
  };


}());
