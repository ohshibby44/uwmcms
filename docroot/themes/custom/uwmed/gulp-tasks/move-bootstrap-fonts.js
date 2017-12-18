/**
 * @file
 * Task: Move: Bootstrap Font Files
 */

/* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('move:bootstrap-fonts', function () {
    return gulp.src([
      options.fonts.bootstrapFiles
    ])
        .pipe(plugins.plumber())
        .pipe(gulp.dest(options.fonts.bootstrapDestination));
  });
};