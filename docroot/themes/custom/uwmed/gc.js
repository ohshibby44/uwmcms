/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */

var gulp = require('gulp');
gulp.gutil = require('gulp-util');
gulp.fancyLog = require('fancy-log');
gulp.concat = require('gulp-concat');


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
var path = require('path');

// These are used in the options below.
var paths = {
    assets: {
        source: 'src/assets',
        destination: 'dist/assets'
    },
    styles: {
        source: 'src/scss',
        destination: 'dist/styles',
        bootstrapSource: 'node_modules/bootstrap-sass/assets/stylesheets',
        //themeComponents: 'src/components',
        lintSource: 'src/{global, components, styleguide}' // don't lint base_theme_overrides`
    },
    scripts: {
        source: 'src/js',
        destination: 'dist/js',
        bootstrapSource: 'node_modules/bootstrap-sass/assets/javascripts/bootstrap',
        bootstrapDestination: 'dist/vendor/js'
    },
    images: {
        source: 'src/assets',
        destination: 'dist/assets'
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

    // ----- ASSETS ----- //

    assets: {
        files: path.join(paths.assets.source, '**/*'),
        destination: path.join(paths.assets.destination)
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
        files: path.join(paths.styles.source, '**/*.scss'),
        //componentFiles: path.join(paths.styles.themeComponents, '**/*.scss'),
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
        files: path.join(paths.images.source, '**/*.{png,gif,jpg,svg}'),
        cleanFiles: path.join(paths.images.destination, '**/*.{png,gif,jpg,svg}'),
        destination: path.join(paths.images.destination)
    },

    // ----- Component collections ----- //
    components: {
        source: 'src/components',
        destination: 'dist/components'
    },

    // ----- Fonts ----- //
    fonts: {
        bootstrapFiles: path.join(paths.fonts.bootstrapSource, '*'),
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
            path.relative(paths.styleGuide.destination, paths.styles.destination + '/style.css')
        ],
        js: [
            path.relative(paths.styleGuide.destination, paths.scripts.bootstrapDestination + '/collapse.js')
        ],
        homepage: '../styleguide/homepage.md',
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
            // debug: console.log.bind(console),
            // error: console.error.bind(console),
            // info: console.info.bind(console)
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

// module.exports = function (gulp, plugins, options) {
//     'use strict';

    gulp.task('default', function () {
    //gulp.task('compile:components', function () {


        gulp.fancyLog('UWM-CMS: Files ', options.components.source);
        gulp.fancyLog('UWM-CMS: Files ', options.components.destination);


        // COMPILE AND MOVE SASS:
        gulp.src([
            options.components.source + '/fact-pages/*.scss'
        ], {base: '.'})

            .on('end', function(){ gulp.fancyLog('Almost there...'); })

            //.pipe(plugins.plumber())
            // .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded',
                // includePaths: options.sass.files
                includePaths: [
                    'node_modules/bootstrap-sass/assets/stylesheets',
                    'src/scss'
                ]
                // includePaths: options.sass.bootstrapFiles
            }))

            .on('end', function(){ gulp.fancyLog('222 Almost there...'); })

            // .pipe(plugins.sourcemaps.write({includeContent: false}))
            // .pipe(plugins.sourcemaps.init({loadMaps: true}))
            // .pipe(plugins.autoprefixer({
            //     browsers: ['last 2 versions', 'ios >= 8'],
            //     cascade: false
            // }))
            // .pipe(plugins.sourcemaps.write())
            .pipe(gulp.dest(options.components.destination));

            // .pipe(plugins.rename({
            //     suffix: '.min'
            // }))
            // .pipe(plugins.cleanCSS({compatibility: 'ie8'}))
            // .pipe(gulp.dest(options.css.destination));


        // COMPILE AND MOVE JS:
        // gulp.src([
        //     options.components.source + '**/*.js'
        // ], {base: '.'})
        //     .pipe(plugins.plumber())
        //     .pipe(plugins.sourcemaps.init())
        //     .pipe(plugins.babel({
        //         presets: ['babel-preset-env']
        //     }))
        //     .pipe(plugins.sourcemaps.write())
        //     .pipe(plugins.plumber.stop())
        //     .pipe(gulp.dest(options.components.destination));


    });
// };