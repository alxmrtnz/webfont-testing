
/* Directives */

(function (angular){

  'use strict';

  var appVersion = require( './directives/appVersion' );

  angular

    .module('myApp.directives', [])

      .directive( 'version', appVersion );

}(angular));
