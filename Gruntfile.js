module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    php: {
      dev: {
        options: {
          bin: '/usr/bin/php', // Mavericks
          // bin: '/usr/local/php5/bin/php', // Mountain Lion (See http://php-osx.liip.ch for PHP 5.4.0+)
          keepalive: true,
          open: true
        }
      }
    },

    phpunit: {
      classes: {
          dir: 'tests/unit/'
      },
      options: {
          bin: 'vendor/bin/phpunit',
          bootstrap: 'tests/unit/bootstrap.php',
          colors: true
      }
    },

    sass: {
      dev: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/<%= pkg.name %>.css': 'stylesheets/pulsar.scss',
          'css/<%= pkg.name %>-ie7.css': 'stylesheets/pulsar-ie7.scss',
          'css/<%= pkg.name %>-ie8.css': 'stylesheets/pulsar-ie8.scss',
          'css/<%= pkg.name %>-ie9.css': 'stylesheets/pulsar-ie9.scss',
          'css/theme.css': 'views/**/theme.scss'
        }
      },
      dist: {
        options: {
          banner: '<%= pkg.banner %>',
          style: 'compressed'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': 'stylesheets/pulsar.scss',
          'dist/css/<%= pkg.name %>-ie7.css': 'stylesheets/pulsar-ie7.scss',
          'dist/css/<%= pkg.name %>-ie8.css': 'stylesheets/pulsar-ie8.scss',
          'dist/css/<%= pkg.name %>-ie9.css': 'stylesheets/pulsar-ie9.scss',
          'dist/css/theme.css': 'views/**/theme.scss'
        }
      }
    },

    watch: {
      css: {
        files: [
          'stylesheets/*.scss',
          'views/**/*.scss'
        ],
        tasks: ['sass:dev'],
        options: {
          livereload: true,
        },
      },
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['js/**/*.js']
    },

    uglify: {
      concat: {
        options: {
          banner: '<%= pkg.banner %>',
          beautify: true
        },
        files: {
          'dist/js/<%= pkg.name %>.js': ['js/**/*.js']
        }
      },
      minify: {
        options: {
          banner: '<%= pkg.banner %>',
          compress: true,
          report: 'min'
        },
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['js/**/*.js']
        }
      }
    },

    asciify: {
      banner:{
        text: '<%= pkg.name %>',
        options: {
          font: 'univers',
          log: true
        }
      },
    },

    copy: {
      dist: {
        src: [
          'docs/**/',
          'docs/**/*.md',
          'docs/images/*',
          '!docs/**/*.php',
          'fonts/**/*',
          'images/*',
          'js/**/*',
          'libs/**/*'
        ],
        dest: 'dist/'
      },
      readme: {
        src: 'docs/01_Getting_started/01_Installation.md',
        dest: 'README.md',
      }
    },

    clean: {
      dist: ['dist'],
      smoketest: ['tmp/failures/*']
    },

    bump: {
      options: {
        updateConfigs: ['pkg'],
        files: ['pulsar.json', 'package.json', 'composer.json', 'VERSION'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: '%VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },

    exec: {
      phantomcss: {
        cmd: 'phantomjs tests/css/testsuite.js'
      },
      updateComposer: {
        cmd: 'sudo php composer.phar update'
      },
      updateBrew: {
        cmd: 'brew update && brew upgrade'
      },
      updateBower: {
        cmd: 'bower update'
      },
      updateGems: {
        cmd: 'sudo gem update'
      },
      updateNpm: {
        cmd: 'sudo npm install'
      }
    },

    requirejs: {
      dist: {
        options: {
          name: 'main',
          mainConfigFile: 'js/main.js',
          // optimize: 'none',
          out: 'dist/js/pulsar.min.js',
          paths: {
            'console-js'        : '../libs/console-js/console',
            'datagrid'          : '../js/datagrid',
            'daterange'         : '../libs/bootstrap-daterangepicker/daterangepicker',
            'deck'              : '../js/deck',
            'dashboard'         : '../js/dashboard',
            'dropdown'          : '../js/dropdown',
            'flash'             : '../js/flash',
            'highcharts'        : '../libs/highcharts/highcharts',
            'highcharts-more'   : '../libs/highcharts/highcharts-more',
            'highcharts-mono'   : '../js/highcharts-mono',
            'highcharts-theme'  : '../js/highcharts-theme',
            'highlightjs'       : '../libs/highlightjs/highlight.pack',
            'homepages'         : '../js/homepages',
            'jquery'            : '../libs/jquery/dist/jquery.min',
            'jquery-ui'         : '../libs/jqueryui/js/jquery-ui-1.10.4.custom.min',
            'jquery-ui-touch'   : '../libs/jqueryui-touch-punch/jquery.ui.touch-punch.min',
            'jquery-mousewheel' : '../libs/jquery-mousewheel/jquery.mousewheel',
            'modal'             : '../js/modal',
            'moment'            : '../libs/moment/moment',
            'navigation'        : '../js/navigation',
            'order'             : '../libs/order/index',
            'pikaday'           : '../libs/pikaday/pikaday',
            'popover'           : '../js/popover',
            'pulsar'            : '../js/pulsar',
            'sticky'            : '../libs/sticky/jquery.sticky',
            'store-js'          : '../libs/store.js/store',
            'tab'               : '../js/tab',
            'tooltip'           : '../js/tooltip',
            'tray'              : '../js/tray',
            'vague'             : '../libs/Vague.js/Vague',
            'zeroclipboard'     : '../libs/zeroclipboard/dist/ZeroClipboard'
          }
        }
      }
    },

    concurrent: {
      dev: ['watch', 'php'],
      options: {
        logConcurrentOutput: true
      }
    }

  });

  grunt.config.set('leadingIndent.indentation', 'spaces');
  grunt.config.set('leadingIndent.files', {
    src : [
      'docs/**/*.md',
      'docs/**/*.php',
      'css/**/*',
      'js/**/*',
      'lexicon/**/*',
      'src/**/*',
      'stylesheets/**/*',
      'tests/**/*',
      'views/**/*'
    ]
  });

  grunt.registerTask('default', ['concurrent:dev']);

  grunt.registerTask('build', [
    'asciify',
    'phpunit',
    // 'leadingIndent:files',
    'clean:dist',
    'sass:dist',
    'copy:dist',
    'copy:readme',
    'requirejs',
  ]);

  grunt.registerTask('pre-commit', [
    'asciify',
    'phpunit',
    // 'leadingIndent:files',
    'copy:readme'
  ]);

  grunt.registerTask('release', [
    'build',
    'bump'
  ]);

  grunt.registerTask('smoketest', [
    'clean:smoketest',
    'exec:phantomcss'
  ]);

  grunt.registerTask('update', [
    'exec:updateComposer',
    'exec:updateBrew',
    'exec:updateBower',
    'exec:updateGems',
    'exec:updateNpm'
  ]);

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

};
