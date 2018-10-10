/**
 * @file
 * Task: Compile: Sass.
 */

/* global module */

module.exports = function (gulp, plugins, options) {

    gulp.task("compile:component-packages", function () {

        gulp
            .src([options.custom_packages.js])
            .pipe(plugins.include())
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(
                plugins.babel({
                    presets: ["babel-preset-env"]
                })
            )
            .pipe(plugins.sourcemaps.write())
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(options.custom_packages.destination));

        gulp
            .src([options.custom_packages.sass])
            .pipe(plugins.plumber())
            .pipe(
                plugins.sass({
                    errLogToConsole: true,
                    outputStyle: "expanded"
                })
            )
            .pipe(
                plugins.autoprefixer({
                    browsers: ["last 2 versions"],
                    cascade: false
                })
            )
            .pipe(gulp.dest(options.custom_packages.destination));

    });
};
