;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{"./controllers.js":2,"./directives.js":4,"./filters.js":6,"./services.js":7}],2:[function(require,module,exports){

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
},{"./controllers/mainCtrl":3}],3:[function(require,module,exports){

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
},{}],4:[function(require,module,exports){

/* Directives */

(function (angular){

  'use strict';

  var appVersion = require( './directives/appVersion' );

  angular

    .module('myApp.directives', [])

      .directive( 'version', appVersion );

}(angular));

},{"./directives/appVersion":5}],5:[function(require,module,exports){


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
},{}],6:[function(require,module,exports){


/* Filters */


(function (angular){

  'use strict';

  angular

    .module('myApp.filters', [])

    .filter('nvd3LineFormat', function (){
      return function (dataSet, key) {
        var item = {};
        item.key = key;
        item.values = [];
        item.values = dataSet.map(function (d){
          return [ d.x, d.y ];
        });
        return item;
      };
    })

    .filter('nvd3ScatterFormat', function (){
      return function (dataSet, key) {
        var item = {};
        item.key = key;
        item.values = [];
        item.values = dataSet.map(function (d){
          return { x: d.x, y: d.y, size: d.size };
        });
        return item;
      };
    })

    .filter('capitalizeFirst', function(){
      return function(text) {
        if (text) {
          return text.charAt(0).toUpperCase() + text.slice(1);
        } else {
          return '';
        }
      };
    });

}(angular));



},{}],7:[function(require,module,exports){

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

},{"./services/awesomeFactory":8,"./services/awesomeService":9}],8:[function(require,module,exports){

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
},{}],9:[function(require,module,exports){

(function(){

  'use strict';

  module.exports = ['$rootScope', function($rootScope){
    this.getAwesome = function() {
      return 'awesome';
    };
  }];

}());
},{}]},{},[1])
;