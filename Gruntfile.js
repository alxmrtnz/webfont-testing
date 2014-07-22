module.exports = function(grunt) {

  var exec = require('child_process').exec;
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var environment = process.env.NODE_ENV || 'virtual';

  var errorMessage = grunt.log.wordlist(["Problem running tasks. See above ^^"],{color : 'red'});

  // This is a utility function. See below to add sub grunt files.
  var runGrunt = function(dir, task) {
    task = task || '';
    var done = this.async();
    var child_process = exec('cd ' + dir + '; ' + task, function(error, stdout, stderr){
      if (error){
        grunt.log.error(errorMessage);
        process.exit(3);
      }
      done();
    });

    child_process.stdout.on('data', function(buf) {
      grunt.log.writeln(String(buf));
    });
  };

  grunt.registerTask('default',function(){
    // This is where you would add your own sub grunt files.
    // like so:
    // runGrunt.call(this, 'client/desktop', 'build');
    runGrunt.call(this, 'client/desktop', 'NODE_ENV='+environment+' grunt build');
  });

};
