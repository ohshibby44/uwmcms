/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */


module.exports = function (gulp, plugins, options) {
    'use strict';


    gulp.task('compile:component-packages', function () {
        
        gulp.src([options.custom_packages.js])
            .pipe(plugins.include())
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel({
                presets: ['babel-preset-env']
            }))
            .pipe(plugins.sourcemaps.write())
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(options.custom_packages.destination));

        gulp.src([options.custom_packages.sass])
            .pipe(plugins.plumber())
            //.pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded'
                // includePaths: options.sass.bootstrapFiles
            }))
            //.pipe(plugins.sourcemaps.write({includeContent: false}))
            //.pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            //.pipe(plugins.sourcemaps.write())
            //.pipe(gulp.concat('styles.css'))
            .pipe(gulp.dest(options.custom_packages.destination));

    });


};




