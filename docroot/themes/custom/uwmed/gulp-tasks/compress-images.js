/**
 * @file
 * Task: Compress: Images.
 */

/* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('compress:images', function () {
    return gulp.src([
      options.images.files
    ])
        .pipe(plugins.plumber())
        .pipe(plugins.imagemin({
          progressive: true,
          svgoPlugins: [{
            removeViewBox: false
          }]
        }))
        .pipe(gulp.dest(options.images.destination));
  });
};