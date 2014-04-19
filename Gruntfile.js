/*jslint node: true*/

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    /* Tasks */
    uglify: {
      main: {
        src: 'src/main.js',
        dest: 'build/jez.min.js'
      }
    },
    jslint: {
      server: {
        src: [
          'src/main.js'
        ],
        directives: {
          node: true,
          todo: true,
          white: true,
          nomen: true,
          plusplus: true,
          bitwise: true,
          maxlen: 120
        },
        options: {
          failOnError: false
        }
      }
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jslint', 'uglify']);
};
