/*
 * grunt-hbs
 *
 * https://github.com/hotuna
 *
 * Copyright (c) 2013 June Park (hotuna)
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var handlebars = require('handlebars');
  var path = require('path');
  var _ = grunt.util._;
  
  grunt.registerMultiTask('hbs', 'handlebar html generator', function(){
    
    var options = this.options();
    
    var srcs = this.data.src.slice();
    
    if (!srcs || srcs.length == 0){
      return;
    }
    
    var dest = this.data.dest;
    var cwd = this.data.cwd;
    var rules = this.data.rules.slice();
    
    for(var i = 0; i < srcs.length; i++){
      srcs[i] =  path.join(cwd, srcs[i]);
    }
    //pre compile template
    _.each(rules, function(rule){
      var layoutFilePath = path.join(cwd, rule.layout);
      var layoutFileContent = grunt.file.read(layoutFilePath);
      var template =  handlebars.compile(layoutFileContent);
      rule.template = template;
    });
    var count = 0;
    
    var executeGenerate = function(filePath, rule){
      
      var template = rule.template;
      
      var file = grunt.file.read(filePath);
      var extension = path.extname(filePath);
      var content = '';
      
      if (extension === '.html'){
         content = template({body: file});
      } else if (extension === '.json'){
         var obj = JSON.parse(file);
         content = template(obj);
      } else{
         grunt.log.writeln(extension + ' is unknown file extension');
         return;
      }
      
      var relativePath = path.relative(cwd, filePath);
      var targetFileRelativePath = relativePath.substring(0, relativePath.lastIndexOf('.')) + '.html';
      var destFilePath = path.join(dest, targetFileRelativePath);
      
      grunt.file.write(destFilePath, content);
      
      count++;
      
    };
    
  
    
    grunt.file.expand(srcs).map(function(srcFile){
      
      var extension = path.extname(srcFile);
      if (extension === '.hbt'){
        _.each(rules, function(rule, idx){
          
          if (path.join(cwd, rule.layout) === srcFile){
            
            grunt.file.expand(path.join(cwd, rule.url)).map(function(url){
              executeGenerate(url, rule);
            });
            //rules.splice(idx);
          }
        });
      } else if (extension === '.html' || extension === '.json'){
        _.each(rules, function(rule, idx){
          
          if (grunt.file.isMatch(path.join(cwd, rule.url), srcFile)){
            executeGenerate(srcFile, rule);
          }
        });
      } else{
        grunt.log.writeln(extension + ' is unknown file extension');
        return;
      }
    });
   
    grunt.log.writeln('total: ' + count + ' files generated');
    
  });

};
