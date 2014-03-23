/*jslint node: true*/

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
  'use strict';
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    uglify: {
      main: {
        src: 'src/main.js',
        dest: 'build/jez.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: 'src/**/*.js'
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', 'uglify');
};
