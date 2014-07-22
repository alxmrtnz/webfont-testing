
(function(){

  'use strict';

  module.exports = ['$scope', 'awesomeFactory', 'Restangular', function ($scope, awesomeFactory, Restangular) {

    console.log('\n-------------- Hello, from mainCtrl --------------\n');

    $scope.awesomeThings = [
      'thing1',
      'thing2'
    ];

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

  }];

}());