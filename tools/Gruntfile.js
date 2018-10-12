module.exports = function(grunt) {
  'use strict';

  var app = {},
    config = {},
    tasks = [
      'grunt-contrib-jshint',
      'grunt-contrib-jasmine',
      'grunt-coveralls',
    ];



  // =============================================
  // jshint
  config.jshint = {};
  config.jshint.options = {
    debug: true,
    sub: true
  };
  config.jshint.all = ['dist/core.js'];



  // =============================================
  // jasmine
  config.jasmine = {};
  config.jasmine.coverage = {
    src: [
      'dist/core.js'
    ],
    options: {
      specs: 'tests/**/*Spec.js',
      template: require('grunt-template-jasmine-istanbul'),
      templateOptions: {
        coverage: 'bin/coverage/coverage.json',
        report: {
          type: 'lcov',
          options: {
            dir: 'bin/coverage'
          }
        },
        thresholds: {
          lines: 75,
          statements: 75,
          branches: 75,
          functions: 90
        }
      }
    }
  }


  // =============================================
  // coveralls
  config.coveralls = {
    src: 'bin/coverage/lcov.info'
  };



  // Load all tasks
  tasks.forEach(grunt.loadNpmTasks);

  // config
  grunt.initConfig(config);




  grunt.registerTask('ci', ['jshint', 'jasmine', 'coveralls']);


};
