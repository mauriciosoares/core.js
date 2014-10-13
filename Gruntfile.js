module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-jasmine',
    'grunt-contrib-watch',
    'grunt-contrib-uglify',
    'grunt-bump'
  ];

  var config = {};

  // =============================================
  // Metadata
  config.pkg = grunt.file.readJSON('package.json');
  config.banner = {
    full:  '/** <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
              '* Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author %>;\n' +
              '* Licensed <%= pkg.license %> \n*/\n\n'
  };

  // =============================================
  // bump
  config.bump = {};
  config.bump.options = {
    files: ['package.json'],
    updateConfigs: [],
    commit: true,
    commitMessage: 'Release v%VERSION%',
    commitFiles: ['package.json'],
    createTag: true,
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: true,
    pushTo: 'https://github.com/msodeveloper/core.js.git',
    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
  };
};