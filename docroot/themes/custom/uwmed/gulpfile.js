// -------------------------------------
//
//   Gulpfile
//
// -------------------------------------
//
// Available tasks:
//   `gulp`
//   'gulp browser-sync'
//   `gulp build`
//   `gulp build:dev`
//   `gulp clean`
//   `gulp clean:css`
//   `gulp clean:styleguide`
//   `gulp compile:js`
//   `gulp compile:sass`
//   `gulp compile:styleguide`
//   `gulp compress:images`
//   `gulp lint:js`
//   `gulp lint:css`
//   `gulp minify:css`
//   `gulp serve`
//   `gulp test:css`
//   `gulp watch`
//   `gulp watch:js`
//   `gulp watch:sass`
//   `gulp watch:styleguide`
//
// -------------------------------------

// -------------------------------------
//   Modules
// -------------------------------------
//
// gulp              : The streaming build system
// gulp-autoprefixer : Prefix CSS
// gulp-concat       : Concatenate files
// gulp-clean-css    : Minify CSS
// gulp-imagemin     : Minify PNG, JPEG, GIF and SVG images
// gulp-load-plugins : Automatically load Gulp plugins
// gulp-parker       : Stylesheet analysis tool
// gulp-plumber      : Prevent pipe breaking from errors
// gulp-rename       : Rename files
// gulp-sass         : Compile Sass
// gulp-sass-lint    : Lint Sass
// gulp-size         : Print file sizes
// gulp-sourcemaps   : Generate sourcemaps
// gulp-uglify       : Minify JavaScript with UglifyJS
// gulp-util         : Utility functions
// gulp-watch        : Watch stream
// browser-sync      : Device and browser testing tool
// del               : delete
// eslint            : JavaScript code quality tool
// kss               : Living Style Guide Generator
// run-sequence      : Run a series of dependent Gulp tasks in order
// -------------------------------------

// -------------------------------------
//   Front-End Dependencies
// -------------------------------------
// kss                   : A methodology for documenting CSS and building style guides
// node-sass             : Wrapper around libsass
// node-sass-import-once : Custom importer for node-sass that only allows a file to be imported once
// -------------------------------------

/* global require */

var gulp = require('gulp');
// Setting pattern this way allows non gulp- plugins to be loaded as well.
var plugins = require('gulp-load-plugins')({
  pattern: '*',
  rename: {
    'node-sass-import-once': 'importOnce',
    'run-sequence': 'runSequence',
    'gulp-clean-css': 'cleanCSS',
    'gulp-stylelint': 'gulpStylelint',
    'gulp-eslint': 'gulpEslint',
    'gulp-babel': 'babel',
    'gulp-util': 'gutil'
  }
});

// Used to generate relative paths for style guide output.
var path = require('path');

// These are used in the options below.
var paths = {
  styles: {
    source: 'src/',
    destination: 'dist/',
    bootstrapSource: 'node_modules/bootstrap-sass/assets/stylesheets',
    lintSource: 'src/{global, components, styleguide}' // don't lint base_theme_overrides`
  },
  scripts: {
    source: 'src/',
    destination: 'dist/',
    bootstrapSource: 'node_modules/bootstrap-sass/assets/javascripts/bootstrap',
    bootstrapDestination: 'dist/vendor/js'
  },
  images: {
    source: 'src/',
    destination: 'dist/'
  },
  styleGuide: {
    watchSource: 'src/',
    destination: 'styleguide'
  },
  fonts: {
    bootstrapSource: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
    bootstrapDestination: 'dist/vendor/fonts'
  }
};

// These are passed to each task.
var options = {

  // ----- Browsersync ----- //

  browserSync: {
    // Put your local site URL here to prevent Browsersync
    // from prompting you to add additional scripts to your page.
    // proxy: {
    //   target: 'http://local.example.com'
    // },
    open: 'external',
    xip: true,
    logConnections: true
  },

  // ----- CSS ----- //

  css: {
    files: path.join(paths.styles.destination, '**/*.css'),
    file: path.join(paths.styles.destination, '/styles.css'),
    destination: path.join(paths.styles.destination)
  },

  // ----- Sass ----- //

  sass: {
    lintFiles: path.join(paths.styles.lintSource, '**/*.scss'),
    files: path.join(paths.styles.source,  '**/*.scss'),
    file: path.join(paths.styles.source, 'styles.scss'),
    destination: path.join(paths.styles.destination),
    bootstrapFiles: paths.styles.bootstrapSource
  },

  // ----- JS ----- //
  js: {
    files: path.join(paths.scripts.source, '**/*.js'),
    destination: path.join(paths.scripts.destination),
    bootstrapFiles: path.join(paths.scripts.bootstrapSource, '*.js'),
    bootstrapDestination: paths.scripts.bootstrapDestination
  },

  // ----- Images ----- //
  images: {
    files: path.join(paths.images.source, '**/images/*.{png,gif,jpg,svg}'),
    cleanFiles: path.join(paths.images.destination, '**/images/*.{png,gif,jpg,svg}'),
    destination: path.join(paths.images.destination)
  },

  // ----- Fonts ----- //
  fonts: {
    bootstrapFiles: path.join(paths.fonts.bootstrapSource, '*' ),
    bootstrapDestination: paths.fonts.bootstrapDestination
  },

  // ----- eslint ----- //
  jsLinting: {
    files: {
      theme: [
        paths.scripts + '**/*.js',
        '!' + paths.scripts + '**/*.min.js'
      ],
      gulp: [
        'gulpfile.js',
        'gulp-tasks/**/*'
      ]
    }

  },

  // ----- KSS Node ----- //
  styleGuide: {
    source: [
      paths.styles.source
    ],
    builder: 'src/styleguide/builder',
    destination: 'styleguide/',
    css: [
      path.relative(paths.styleGuide.destination, paths.styles.destination + 'global/style.css')
    ],
    js: [
      path.relative(paths.styleGuide.destination, paths.styles.destination + 'vendor/js/collapse.js')
    ],
    homepage: 'styleguide/homepage.md',
    title: 'UW Medicine Drupal Style Guide',
    watchSource: path.join(paths.styleGuide.watchSource, '**/*.*')
  },

  // ------ pa11y ----- //
  pa11y: {
    urls: [ // An array of urls to test.
      // For testing in a travis environment:
      // 'http://127.0.0.1:8888',
      // 'http://127.0.0.1:8888/themes/custom/yourtheme/styleguide'
    ],
    failOnError: true, // fail the build on error
    showFailedOnly: true, // show errors only and override reporter
    reporter: 'console',
    log: {
      debug: console.log.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console)
    },
    standard: 'WCAG2AA', // choose from Section508, WCAG2A, WCAG2AA, and WCAG2AAA
    page: {
      settings: {
        loadImages: false,
        userName: '', // .htacess username
        password: '' // .htaccess password
      }
    },
    threshold: { // Set to -1 for no threshold.
      errors: 10,
      warnings: 10,
      notices: 20
    }
  }

};

// Tasks
require('./gulp-tasks/browser-sync')(gulp, plugins, options);
require('./gulp-tasks/build')(gulp, plugins, options);
require('./gulp-tasks/clean')(gulp, plugins, options);
require('./gulp-tasks/clean-css')(gulp, plugins, options);
require('./gulp-tasks/clean-images')(gulp, plugins, options);
require('./gulp-tasks/clean-styleguide')(gulp, plugins, options);
require('./gulp-tasks/compile-sass')(gulp, plugins, options);
require('./gulp-tasks/compile-js')(gulp, plugins, options);
require('./gulp-tasks/compile-styleguide')(gulp, plugins, options);
require('./gulp-tasks/compress-images')(gulp, plugins, options);
require('./gulp-tasks/default')(gulp, plugins, options);
require('./gulp-tasks/lint-js')(gulp, plugins, options);
require('./gulp-tasks/lint-css')(gulp, plugins, options);
require('./gulp-tasks/minify-css')(gulp, plugins, options);
require('./gulp-tasks/move-bootstrap-fonts')(gulp, plugins, options);
require('./gulp-tasks/move-bootstrap-scripts')(gulp, plugins, options);
require('./gulp-tasks/serve')(gulp, plugins, options);
require('./gulp-tasks/test-css')(gulp, plugins, options);
require('./gulp-tasks/watch')(gulp, plugins, options);
require('./gulp-tasks/pa11y')(gulp, plugins, options);

// Credits:
//
// - http://drewbarontini.com/articles/building-a-better-gulpfile/
// - https://teamgaslight.com/blog/small-sips-of-gulp-dot-js-4-steps-to-reduce-complexity
// - http://cgit.drupalcode.org/zen/tree/STARTERKIT/gulpfile.js?h=7.x-6.x
// - https://github.com/google/web-starter-kit/blob/master/gulpfile.js