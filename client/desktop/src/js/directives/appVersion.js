

(function(){

  'use strict';

  module.exports = ['version', function (version) {

    return {
      restrict: 'E',
      template: '<span>{{ version }}</span>',
      link: function(scope, el, attrs) {
        scope.version = version;
      }
    };
  }];

}());