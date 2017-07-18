/**
 * @file
 * Task: Watch.
 */

module.exports = function (gulp, plugins, options) {
  'use strict';
  gulp.task('watch', ['watch:sass', 'watch:js']);

  gulp.task('watch:js', function () {
    return plugins.watch([
      options.js.files
    ], ['lint:js']);
  });

  gulp.task('watch:sass', function () {
    return plugins.watch([
      options.sass.files
    ], ['compile:sass', 'minify:css']);
  });

};
