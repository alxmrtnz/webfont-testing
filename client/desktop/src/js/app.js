
(function (angular){

  'use strict';

  var module = angular.module('myApp', [
    'ngRoute',
    'restangular',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'
  ]);

  module

    .config(

      ['$routeProvider', '$locationProvider',

      function ($routeProvider, $locationProvider) {

        // seo configuratio
        $locationProvider
          .html5Mode(true);
        $locationProvider
          .hashPrefix('!');

        // our routes
        $routeProvider
          .when('/', {templateUrl: 'partials/home.html', controller: 'MainCtrl'})
          .when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MainCtrl'})
          .when('/view2', {templateUrl: 'partials/partial2.html', controller: 'SecondaryCtrl'})
          .when('/404', {templateUrl: '404.html', controller: ['$window', function($window) { $window.location.href = '/404.html'; }]})
          .otherwise({redirectTo: '/404'});
      }]
     );

  require('./controllers.js');
  require('./directives.js');
  require('./filters.js');
  require('./services.js');

}(angular));
