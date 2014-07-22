
/**
 * This file gets pushed to client
 */
'use strict';

var socket = io.connect( 'http://localhost:{{ port }}' );

socket.on('refresh', function () {
  window.location = document.URL;
});