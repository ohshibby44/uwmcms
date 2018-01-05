/**
 * @file
 * Task: Move: Bootstrap Script Files
 */

/* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('move:bootstrap-scripts', function () {
    return gulp.src([
      options.js.bootstrapFiles
    ])
        .pipe(plugins.plumber())
        .pipe(gulp.dest(options.js.bootstrapDestination));
  });
};