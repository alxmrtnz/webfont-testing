
(function (angular){

  'use strict';

  var mainCtrl = require( './controllers/mainCtrl' );

  angular

    .module('myApp.controllers', [])

      .controller( 'MainCtrl', mainCtrl )

      .controller('SecondaryCtrl', ['$scope', function($scope) {
        this.stuff = {
          data: 'yea'
        };
      }]);

}(angular));