/**
 * @file
 * Task: Watch.
 */

 /* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('watch', ['watch:sass', 'watch:styleguide', 'watch:js']);

  gulp.task('watch:js', function () {
    return gulp.watch([
      options.js.files, options.custom_packages.js
    ], function () {
      plugins.runSequence(
        'lint:js',
        'compile:js',
        'compile:component-packages',
        'browser-sync:reload'
      );
    });
  });

  gulp.task('watch:sass', function () {
    return gulp.watch([
        options.sass.files, options.sass.componentFiles, options.custom_packages.sass
    ], function () {
      plugins.runSequence(
        'compile:sass',
        'compile:component-packages',
        'minify:css',
        'browser-sync:reload'
      );
    });
  });

  gulp.task('watch:styleguide', function () {
    return gulp.watch([
      options.sass.files,
      options.styleGuide.watchSource
    ], function () {
      plugins.runSequence(
        'compile:styleguide'
      );
    });
  });
};
