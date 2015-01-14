module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-jasmine',
    'grunt-contrib-watch',
    'grunt-contrib-uglify',
    'grunt-coveralls',
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

  // =============================================
  // jshint
  config.jshint = {};
  config.jshint.options = {
    debug: true
  };
  config.jshint.all = ['dist/core.js'];

  // =============================================
  // concat
  config.concat = {
    options: {
      banner: '<%= banner.full %>'
    },
    dist: {
      src: [
        'src/umd/head.js',
        'src/core/core.js',
        'src/helpers/*.js',
        'src/core/**/*.js',
        'src/sandbox/sandbox.js',
        'src/umd/foot.js'
      ],
      dest: 'dist/core.js'
    }
  };

  // =============================================
  // watch
  config.watch = {};
  config.watch.scripts = {
    files: ['src/**/*.js'],
    tasks: ['concat', 'jshint'],
    options: {
      spawn: false,
    }
  }

  // =============================================
  // uglify
  config.uglify = {};
  config.uglify.all = {
    files: {
      'dist/core.min.js': [ 'dist/core.js' ]
    },
    options: {
      preserveComments: false,
      sourceMap: 'dist/core.min.map',
      sourceMappingURL: 'core.min.map',
      report: 'min',
      beautify: {
        ascii_only: true
      },
      banner: '<%= banner.full %>',
      compress: {
        hoist_funs: false,
        loops: false,
        unused: false
      }
    }
  }

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

  // =============================================
  // config
  grunt.initConfig(config);

  // Load all tasks
  tasks.forEach(grunt.loadNpmTasks);

  grunt.registerTask('ci', ['jshint', 'jasmine', 'coveralls']);
};
