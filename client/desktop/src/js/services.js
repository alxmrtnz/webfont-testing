
(function (angular){

  'use strict';

  var awesomeService = require( './services/awesomeService' );
  var awesomeFactory = require( './services/awesomeFactory' );

  angular

    .module('myApp.services', [])

      .value( 'version', '0.1' )

      .factory( 'awesomeFactory', awesomeFactory )

      .service( 'awesomeService', awesomeService );

}(angular));
