/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */


module.exports = function (gulp, plugins) {
    'use strict';


    gulp.task('compile:component-packages', function () {

        var opts = {
            packages: {
                src: [
                    './src/component-packages/'
                ],
                dest: './dist/component-packages'
            }
        };


        gulp.src(opts.packages.src + '**/*.js')
            .pipe(plugins.include())
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel({
                presets: ['babel-preset-env']
            }))
            .pipe(plugins.sourcemaps.write())
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(opts.packages.dest));

        return gulp.src(opts.packages.src + '**/*.scss')
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
            .pipe(gulp.dest(opts.packages.dest));

    });


};




