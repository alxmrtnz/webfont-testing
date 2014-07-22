
(function (angular){

  'use strict';

  angular.module('myApp.seo', [])
    .run([

    '$rootScope',

    function ($rootScope) {
      $rootScope.htmlReady = function() {
        $rootScope.$evalAsync(function() {
          setTimeout(function() {
            if (typeof window.callPhantom === 'function') {
              window.callPhantom();
            }
          }, 0);
        });
      };
    }
  ]);

}(angular));
