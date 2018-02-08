/**
 * @file
 * Task: Move: Bootstrap Font Files
 */

/* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('move:assets', function () {
    return gulp.src([
      options.assets.files
    ])
        .pipe(plugins.plumber())
        .pipe(gulp.dest(options.assets.destination));
  });
};