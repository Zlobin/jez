/*jslint node: true*/

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

  grunt.registerTask('default', ['jshint', 'uglify']);
};
