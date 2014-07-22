
(function(){

  'use strict';

  module.exports = ['$rootScope', function ($rootScope) {
    var awesome = null;

    return {
      makeAwesome: function() {
        if ( !awesome ) {
          awesome = {};
        }
      },

      getAwesome: function() {
        return awesome;
      }
    };
  }];

}());