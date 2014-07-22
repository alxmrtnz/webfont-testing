
var path = require('path');
var bower = require('bower');
var fs = require('fs');
var grunt = require('grunt');

(function(){

  'use strict';

  var isArray = function (value) {
    return value &&
      typeof value === 'object' &
      typeof value.length === 'number' &&
      typeof value.splice === 'function' &&
      !(value.propertyIsEnumerable('length'));
  };

  var findBowerDeps = function (parentDep, knownDeps) {
    var pkgDeps = parentDep.dependencies;
    var deps;

    for (var i in pkgDeps) {
      var dep = pkgDeps[ i ];
      var main;
      if ( dep && dep.pkgMeta && !knownDeps[ dep.endpoint.name ]) {
        if ( dep.pkgMeta.main ) {
          main = dep.pkgMeta.main;
        }

        if ( !main ) {
          return;
        }

        if ( !deps ) {
          deps = [];
        }

        var name = dep.endpoint.name;
        var pathToParentDeps = parentDep.canonicalDir;
        var depPath = path.join( pathToParentDeps, '../', name, main );

        deps.push( depPath );
      }
    }
    return deps;
  };


  exports.fetchBowerPackages = function(config, callback) {
    var data = fs.readFileSync( path.join( __dirname, 'bower.json') );
    var bowerFile = JSON.parse( data );
    var bowerDeps = bowerFile.dependencies;
    var overrides = bowerFile.exportsOverride || {};
    var orderedDeps = [];

    for (var i in bowerDeps) {
      orderedDeps.push( i );
    }

    // orderedDeps just gives us the name for each dependency.
    // we need to use the bower API to extract some information.
    bower
      .commands
      .list('paths')
      .on('end', function (info){
        var deps = info.dependencies;
        var obj = [];

        orderedDeps.forEach(function (depName){
          console.log('Resolving bower dependency ' + depName);
          var dep = deps[ depName ];
          var depPath, main;
          var depsOfdep = findBowerDeps( dep, deps );
          var name = dep.endpoint.name;
          var topDir = dep.canonicalDir;

          // if the current dependency has it's own bower dependencies
          // extract them and insert them before we insert the current
          // dependency so as to maintain order
          if ( depsOfdep ) {
            obj = obj.concat( depsOfdep );
          }

          if ( dep.pkgMeta && dep.pkgMeta.main ) {
            topDir = dep.canonicalDir;
            main = dep.pkgMeta.main;
          } else if ( overrides[ depName ] ) {
            topDir = path.join( __dirname, config.frontend.lib, depName );
            // sorcery to extract the target filename
            var pathArray = overrides[ depName ][ '' ][ 0 ].split( '/' );
            main = pathArray[ pathArray.length - 1 ];
            console.log(main);
          } else {
            // At this point, bower doesn't know where to find this dep's main file and YOU have failed to configure
            // it in bower.json > exportOverrides....naughty boy/girl
            var line1 = "     I don't know how to find dep: '' + depName + ''. If you don't fix this, you're going to have a bad time.";
            var line2 = "     Override the main js file for '' + depName + '' via bower.json > exportOverrides";

            console.error( '******************************************************************'.red );
            console.error( line1.red );
            console.error( line2.red );
            console.error( '******************************************************************\n'.red );
            process.exit(1);
          }

          if ( !topDir ) { topDir = path.resolve( __dirname ); }

          // Handle the case where we have an array for a main entry
          if (isArray(main)) {
            for (var i = 0; i < main.length; i++) {
              obj.push( path.join( topDir, main[i] ) );
              console.log( path.join( topDir, main[i] ) );
            }
          } else {
            obj.push( path.join( topDir, main ) );
            console.log( path.join( topDir, main ) );
          }

        });

        // need to re-inject dependencies to concat task
        // grunt.config.set('concat.jsVendor.src', obj);

        return callback(null, obj);
      });
  };
}());