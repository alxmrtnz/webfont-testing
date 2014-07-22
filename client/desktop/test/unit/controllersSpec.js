

/* global describe: true, beforeEach: true, inject:true, it:true, expect:true */

describe('Controller Tests', function(){

  'use strict';

  var scope;
  var mainCtrl;
  var aFactory;
  var r;

  beforeEach(module('myApp'));
  beforeEach(module('myApp.controllers'));
  beforeEach(module('myApp.services'));

  beforeEach(function(){
    inject(function($rootScope, $controller, $injector) {
      scope = $rootScope.$new();
      aFactory = $injector.get('awesomeFactory');
      r = $injector.get('Restangular');
      mainCtrl = $controller('MainCtrl',
        {
          $scope: scope,
          awesomeFactory: aFactory,
          Restangular: r
        });
    });
  });

  it('should work', function(){
    expect(scope.awesomeThings[0]).toEqual('thing1');
    expect(scope.awesomeThings[1]).toEqual('thing2');
    var awesome = aFactory.getAwesome();
    expect(awesome).toBeNull();
    aFactory.makeAwesome();
    awesome = aFactory.getAwesome();
    expect(awesome).toBeDefined();
  });

  describe('MainCtrl', function() {
    it('should work', function(){
      expect(scope.awesomeThings[0]).toEqual('thing1');
      expect(scope.awesomeThings[1]).toEqual('thing2');
      var awesome = aFactory.getAwesome();
      expect(awesome).toBeNull();
      aFactory.makeAwesome();
      awesome = aFactory.getAwesome();
      expect(awesome).toBeDefined();
    });
  });
});
