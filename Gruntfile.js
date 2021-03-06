module.exports = function(grunt) {
  var pkgs = [
    'jsxhint',
    'react',
    'jest',
    'browserify',
    'express-server',
    'contrib-watch',
    'contrib-sass',
    'contrib-uglify']

  pkgs.forEach(function(name) {
    grunt.loadNpmTasks('grunt-' + name);
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // jest
    jest: {
      options: {
        coverage: true,
        testPathPattern: /.*-test.js/
      }
    },

    // jshint
    jshint: {
      options: {
        ignores: ['app/client/js/bundle.js']
      },
      main: {
        src: [
          'app/client/js/**/*.{js,jsx}',
          'app/server/**/*.js'
        ]
      }
    },

    // sass
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/client/css/main.css': 'app/client/css/main.scss'
        }
      }
    },

    // react
    react: {
      files: {
        expand: true,
        cwd: 'app/client/js',
        src: ['**/*.jsx'],
        dest: 'app/client/js',
        ext: '.js'
      }
    },

    // browserify
    browserify: {
      main: {
        options: {
          transform: [
            require('grunt-react').browserify,
            'envify'
          ],
          browserifyOptions: {
            debug: true
          }
        },
        src: 'app/client/js/app.react.js',
        dest: 'app/client/js/bundle.js'
      }
    },

    // watch
    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      server: {
        files:  ['app/server/**/*.js'],
        tasks:  ['jshint', 'express:dev'],
        options: {
          liveload: false,
        }
      },
      client: {
        files: [
          'node_modules/deck-of-cards/dist/deck.js',
          'app/client/js/components/**/*.{js,jsx}',
          'app/client/js/game/**/*.js'
        ],
        tasks: ['jshint', 'browserify']
      },
      html: {
        files: ['app/views/**/*.html']
      },
      css: {
        files: ['app/client/css/**/*.scss'],
        tasks: ['sass']
      },
      test: {
        files: [
          'app/client/js/components/**/*.{js,jsx}',
          'app/client/js/__tests__/**/*-test.js'],
        tasks: ['jest'],
        options: {
          livereload: false,
          spawn: true
        }
      }
    },

    // express
    express: {
      options: {
      },
      dev: {
        options: {
          script: 'app/server/server.js'
        }
      },
      prod: {
        options: {
          script: 'app/server/server.js',
          node_env: 'production'
        }
      }
    }
  });

  grunt.registerTask('test', ['jest']);
  grunt.registerTask('dev', ['jshint', 'sass', 'browserify', 'express:dev', 'watch']);
};
