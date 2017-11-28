var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')({lazy: true}),
  args = require('yargs').argv;

var
  config = {
    sassIncludePaths: [
      'node_modules/bootstrap-sass/assets/stylesheets'
    ],
    javascriptFiles: [
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/*.js',
      'node_modules/stickybits/dist/*.js',
      'node_modules/jquery-validation/dist/jquery.validate*.js'
    ],
    fontFiles: [
      'node_modules/bootstrap-sass/assets/fonts/bootstrap/*'
    ]
  };

gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
    .pipe($.sass({
      includePaths: config.sassIncludePaths
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 10']
    }))
    .pipe(gulp.dest('css'))
});

gulp.task('javascript', function() {
  return gulp.src(config.javascriptFiles)
    .pipe(gulp.dest('./js/vendor'));
});

gulp.task('fonts', function() {
  return gulp.src(config.fontFiles)
    .pipe(gulp.dest('./fonts/vendor'));
});

gulp.task('default', ['sass', 'javascript', 'fonts']);

gulp.task('watch', ['sass', 'javascript', 'fonts'], function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});
