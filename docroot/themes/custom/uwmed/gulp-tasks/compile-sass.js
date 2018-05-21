/**
 * @file
 * Task: Compile: Sass.
 */

 /* global module */

module.exports = function (gulp, plugins, options) {
  'use strict';

  gulp.task('compile:sass', function () {
    return gulp.src([
      options.sass.files
    ])
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        errLogToConsole: true,
        outputStyle: 'expanded',
        includePaths: options.sass.bootstrapFiles
      }))
      .pipe(plugins.sourcemaps.write({includeContent: false}))
      .pipe(plugins.sourcemaps.init({loadMaps: true}))
      .pipe(plugins.autoprefixer({
        browsers: ['last 2 versions', 'ios >= 8'],
        cascade: false
      }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(options.sass.destination));
  });
};