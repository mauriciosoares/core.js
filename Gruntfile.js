module.exports = function(grunt) {
  'use strict';

  var app = {},
    config = {},
    tasks = [
      'grunt-contrib-jshint',
      'grunt-contrib-concat',
      'grunt-contrib-jasmine',
      'grunt-contrib-watch',
      'grunt-contrib-uglify',
      'grunt-coveralls',
      'grunt-bump',
      'grunt-umd'
    ];

  // get patch if it's release
  app.patch = grunt.option('patch');

  // config pack
  app.pack = grunt.config('pkg', grunt.file.readJSON('package.json'));

  // config banner
  app.banner =  '/** ' +
                '\n* ' + app.pack.name + ' -v' + grunt.file.readJSON('package.json').version +
                '\n* Copyright (c) '+ grunt.template.today('yyyy') + ' ' + app.pack.author +
                '\n* Licensed ' + app.pack.license + '\n*/\n\n';


  // =============================================
  // bump
  config.bump = {};
  config.bump.options = {
    files: ['package.json'],
    updateConfigs: [],
    commit: true,
    commitMessage: 'Release v%VERSION%',
    commitFiles: [
      'package.json',
      'dist'
    ],
    createTag: true,
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: true,
    pushTo: 'origin',
    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
  };

  // =============================================
  // jshint
  config.jshint = {};
  config.jshint.options = {
    debug: true,
    sub: true
  };
  config.jshint.all = ['dist/core.js'];

  // =============================================
  // concat
  config.concat = {
    options: {
      banner: app.banner
    },
    dist: {
      src: [
        'src/core/core.js',
        'src/helpers/*.js',
        'src/core/**/*.js',
        'src/sandbox/sandbox.js'
      ],
      dest: 'dist/core.js'
    }
  };

  // =============================================
  // watch
  config.watch = {};
  config.watch.scripts = {
    files: ['src/**/*.js'],
    tasks: ['concat', 'umd','jshint'],
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
      banner: app.banner,
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
  // umd
  config.umd = {};
  config.umd = {
    all: {
      options: {
        src: 'dist/core.js',
        objectToExport: 'Core'
      }
    }
  };

  // =============================================
  // coveralls
  config.coveralls = {
    src: 'bin/coverage/lcov.info'
  };

  // Load all tasks
  tasks.forEach(grunt.loadNpmTasks);

  // config
  grunt.initConfig(config);


  grunt.registerTask('dist', ['jshint', 'concat', 'umd', 'jasmine', 'uglify']);

  grunt.registerTask('ci', ['jshint', 'jasmine', 'coveralls']);

  grunt.registerTask('release', function () {
    grunt.task.run('bump-only%patch%'.replace('%patch%', app.patch ? ':' + app.patch : ''));
    grunt.task.run('dist');
  });
};
