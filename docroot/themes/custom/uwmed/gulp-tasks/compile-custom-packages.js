/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */

module.exports = function (gulp, plugins, options) {

    'use strict';

    gulp.task('compile:compile-custom-packages-sass', function () {


        gulp.gutil.log('Compiling packages scripts ', options.custom_packages.sassFiles);

        return gulp.src(
            [options.custom_packages.sassFiles],
            {base: options.custom_packages.base}
        )
            .pipe(plugins.plumber())
            .pipe(plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded',
                includePaths: options.custom_packages.sassIncludes
            }))
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulp.dest(options.custom_packages.destination));

    });

    gulp.task('compile:compile-custom-packages-js', function () {

        gulp.gutil.log('Compiling packages scripts ', options.custom_packages.jsFiles);

        return gulp.src(
            [options.custom_packages.jsFiles],
            {base: options.custom_packages.base}
        )
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel({
                presets: ['babel-preset-env']
            }))
            .pipe(plugins.sourcemaps.write())
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(options.custom_packages.destination));

    });



};




