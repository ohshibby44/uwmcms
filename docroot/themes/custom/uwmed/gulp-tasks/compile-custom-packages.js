/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */

module.exports = function (gulp, plugins, options) {

    'use strict';

    gulp.task('compile:compile-custom-packages-sass', function () {

        return gulp.src(
            options.components.sassFiles,
            {base: options.components.folder_base}
        )
            .pipe(plugins.plumber())
            .pipe(plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded'
            }))
            .pipe(plugins.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulp.dest(options.components.destination));

    });

    gulp.task('compile:compile-custom-packages-js', function () {

        return gulp.src([
            options.component_js_source_files,
            {base: options.component_source_base}
        ])
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel({
                presets: ['babel-preset-env']
            }))
            .pipe(plugins.sourcemaps.write())
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(options.components.destination));

    });


};




