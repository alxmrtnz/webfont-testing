
(function(){

  'use strict';

  module.exports = function (grunt) {

    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
    var cp = require('child_process');
    var path = require('path');
    var exec = require('child_process').exec;
    var async = require('async');
    var sugar = require('sugar');
    var version, clientType, projectNameDashed;
    var environment = process.env.NODE_ENV || 'local';
    var sharedSettings = grunt.file.readJSON('../../shared-settings.json');
    var buildUtils = require('./buildUtils');
    var assetsUrl = '';
    var dataUrl = '';
    grunt.loadNpmTasks('assemble');

    var getVariables = function(callback){
      var tasks = [ getVersion, getCWD, getGitRepoName, getAssetsUrl, setGruntVariables ];
      return async.series( tasks, callback );
    };

    var fetchBowerPackages = function(callback) {
      buildUtils.fetchBowerPackages(config, function (err, packagePaths){
        if (err) {
          console.error( 'An error occured'.red );
          process.exit();
        }
        grunt.config.set('concat.jsVendor.src', packagePaths);
        return callback();
      });
    };

    var getVersion = function(callback){
      exec('git rev-parse HEAD', function(error, stdout, stderr){
        version = stdout.replace('\n', '');
        if (callback) { return callback(); }
      });
    };

    var getCWD = function(callback){
      clientType = __dirname.split('/').last();
      if (callback) { return callback(); }
    };

    var getGitRepoName = function(callback){
      exec('basename `git config --get remote.origin.url` .git', function(error, stdout, stderr){
        projectNameDashed = stdout.replace('\n', '').replace('_','-');
        if (callback) { return callback(); }
      });
    };

    var getAssetsUrl = function(callback){
      if(sharedSettings[environment].assetsDomain && sharedSettings[environment].assetsDomain !== ''){
        assetsUrl = '//' + sharedSettings[environment].assetsDomain;
      } else if(environment === 'virtual' || environment === 'local') {
        assetsUrl = '/assets';
      } else {
        assetsUrl = '//s3.amazonaws.com/isl-{environment}-{projectNameDashed}-client-{clientType}'.assign({
          environment : environment,
          projectNameDashed : projectNameDashed,
          clientType : clientType
        });
      }
      if (callback) { return callback(); }
    };

    var setGruntVariables = function(callback){
      grunt.config.set('assetsUrl', assetsUrl);
      grunt.config.set('version', version);

      var dataIsSecure = sharedSettings[ environment ].dataIsSecure;

      if(dataIsSecure){
        grunt.config.set('dataUrl', 'https://' + sharedSettings[environment].dataUrl + ':443');
      } else {
        grunt.config.set('dataUrl', 'http://' + sharedSettings[environment].dataUrl);
      }

      if (callback) { return callback(); }
    };

    var config = {
      frontend : {
        src : 'src',
        pages : 'dist/pages',
        assets : 'dist/assets',
        css : '.tmp/css',
        lib : '.tmp/lib',
        defaultBower: 'bower_components'
      }
    };

    grunt.initConfig({

      sharedSettings: sharedSettings,
      version : 'unversioned',
      config : config,

      clean: {
        pre : ['<%= config.frontend.pages %>','<%= config.frontend.assets %>'],
        post : ['<%= config.frontend.css %>']
      },

      bower: {
        dev: {
          options : {
            targetDir: '<%= config.frontend.lib %>',
            layout: 'byType',
            install: true,
            verbose: false,
            cleanTargetDir: false,
            cleanBowerDir: false,
            forceLatest: true,
            production: true
          }
        }
      },

      assemble : {
        options : {
          version : '<%= version %>',
          assetsUrl : '<%= assetsUrl %>',
          dataUrl : '<%= dataUrl %>',
          livereload: '<%= livereload %>',
          dataIsSecure : '<%- sharedSettings[\'{1}\'].dataIsSecure %>'.assign(environment),
          environment : environment
        },
        index : {
          options : {
            layout: '<%= config.frontend.src %>/default.hbs'
          },
          src : '<%= config.frontend.src %>/index.hbs',
          dest : '<%= config.frontend.pages %>/index.html'
        },
        partials : {
          options : {
            flatten: true
          },
          src : '<%= config.frontend.src %>/partials/*.hbs',
          dest : '<%= config.frontend.pages %>/partials/'
        }
      },

      compass : {
        dev: {
          options: {
            sassDir: '<%= config.frontend.src %>/sass',
            cssDir: '<%= config.frontend.css %>',
            outputStyle : 'compressed',
            noLineComments : true
          }
        }
      },

      watch: {
        html: {
          files: ['src/**/*.hbs', 'src/**/*.html'],
          tasks: ['vars', 'assemble', 'copy:pages', 'rename']
        },
        css: {
          files: ['src/**/*.scss', 'src/**/*.css'],
          tasks: ['vars', 'compass', 'copy:css', 'concat:cssApp', 'concat:cssVendor']
        },
        js: {
          files: ['src/**/*.js'],
          tasks: ['vars:b', 'browserify']
        }
      },

      karma: {
        unit: {
          configFile: './config/karma.conf.js',
          autoWatch: true
        }
      },

      copy : {
        images : {
          expand : true,
          cwd : '<%= config.frontend.src %>/img/',
          src: ['**/*'],
          dest: '<%= config.frontend.assets %>/img/'
        },
        fonts : {
          expand : true,
          cwd : '<%= config.frontend.src %>/fonts/',
          src: ['**/*'],
          dest: '<%= config.frontend.assets %>/fonts/'
        },
        pages : {
          expand : true,
          cwd : '<%= config.frontend.src %>',
          src: ['**/*.html', '**/*.txt'],
          dest: '<%= config.frontend.pages %>'
        },
        css : {
          expand : true,
          cwd : '<%= config.frontend.src %>/',
          src: ['**/*.css'],
          dest: '<%= config.frontend.css %>/'
        }
      },

      rename: {
        jsApp: {
          src: '<%= config.frontend.assets %>/js/app.*.js',
          dest: '<%= config.frontend.assets %>/js/app.<%= version %>.js'
        },
        jsVendor: {
          src: '<%= config.frontend.assets %>/js/vendor.*.js',
          dest: '<%= config.frontend.assets %>/js/vendor.<%= version %>.js'
        },
        cssVendor: {
          src: '<%= config.frontend.assets %>/css/vendor.*.css',
          dest: '<%= config.frontend.assets %>/css/vendor.<%= version %>.css'
        },
        cssApp: {
          src: '<%= config.frontend.assets %>/css/app.*.css',
          dest: '<%= config.frontend.assets %>/css/app.<%= version %>.css'
        }
      },

      concat : {
        jsVendor : {
          // this object will get re-injected at a later point in the
          // build process
          src: [],
          dest: '<%= config.frontend.assets %>/js/vendor.<%= version %>.js'
        },
        cssVendor : {
          src: ['<%= config.frontend.lib %>/**/*.css'],
          dest: '<%= config.frontend.assets %>/css/vendor.<%= version %>.css'
        },
        cssApp : {
          src: ['<%= config.frontend.css %>/**/*.css'],
          dest: '<%= config.frontend.assets %>/css/app.<%= version %>.css'
        }
      },

      browserify: {
        app: {
          src : ['<%= config.frontend.src %>/js/app.js'],
          dest : '<%= config.frontend.assets %>/js/app.<%= version %>.js'
        }
      },

      uglify : {
        options: {
          mangle: false
        },
        app : {
          src : ['<%= config.frontend.assets %>/js/app.<%= version %>.js'],
          dest : '<%= config.frontend.assets %>/js/app.<%= version %>.js'
        },
        vendor: {
          src : ['<%= config.frontend.assets %>/js/vendor.<%= version %>.js'],
          dest : '<%= config.frontend.assets %>/js/vendor.<%= version %>.js'
        }
      }
    });

    grunt.registerTask('vars', function(runBower){
      var done = this.async();
      if ( environment === 'local' ) {
        grunt.config.set( 'livereload', true );
      }
      getVariables(function(){
        setGruntVariables(function(){
          if ( runBower ) {
            fetchBowerPackages(function(){
              done();
            });
          } else {
            done();
          }
        });
      });
    });

    grunt.registerTask('pre', function(){
      var done = this.async();
      getVariables(function(){
        done();
      });
    });

    grunt.registerTask('pre-build', function(){
      grunt.task.run([ 'pre', 'clean:pre', 'bower']);
    });

    grunt.registerTask('async-build', function(){
      var done = this.async();
      var livereload = ( environment === 'local' ) ? true : false;
      grunt.config.set( 'livereload', livereload );
      fetchBowerPackages(function(){
        grunt.task.run([
          'assemble',
          'compass',
          'browserify',
          'copy',
          'concat',
          'clean:post'
        ]);

        if(environment === 'production' || environment === 'staging'){
          grunt.task.run('uglify');
        }

        return done();
      });
    });

    grunt.registerTask('build', function(){
      // had to break up build to accomodate async tasks
      grunt.task.run(['pre-build', 'async-build']);
    });

    grunt.registerTask('server', function(){
      var server = cp.spawn('node', ['scripts/web-server.js', '--force', 'default', 'watch']);
      // wait indefinitely - terminating when the user terminates the process manually
      var done = this.async();
      server.stdout.on('data', function(data) {
        console.log('%s', data);
      });
      server.stderr.on('data', function(data) {
        console.log('%s', data);
      });
    });

    grunt.registerTask('test', function(){
      grunt.task.run([
        'karma'
        // Add more tasks here for test
      ]);
    });


    grunt.registerTask('default',['build']);

  };

}());

