

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


