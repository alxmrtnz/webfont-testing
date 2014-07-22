module.exports = function(config){

  'use strict';

  config.set({
    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'test/lib/angular/angular-*.js',
      'http://localhost:3006/socket.io/socket.io.js',
      'dist/assets/js/**/*.js',
      'test/unit/controllersSpec.js'
    ],

    exclude : [
      'test/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]

  });

};
