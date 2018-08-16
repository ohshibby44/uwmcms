/**
 * @file
 * Task: Compile: JavaScript.
 */

/* global module */

module.exports = function (gulp, plugins, options) {
    'use strict';

    var jsIncludeOptions = {
        extensions: "js",
        hardFail: true,
        includePaths: [
            __dirname + "/bower_components",
            __dirname + "/bower_components2",
            options.libraries.files
        ]
    };

    gulp.task('compile:js-includes', function () {

        return gulp.src(options.libraries.files)
            .pipe(plugins.plumber())
            .pipe(plugins.include(jsIncludeOptions))
            .pipe(plugins.plumber.stop())
            .pipe(gulp.dest(options.libraries.destination));


    });
};
