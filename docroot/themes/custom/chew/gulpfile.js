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
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'
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

gulp.task('default', ['sass', 'javascript']);

gulp.task('watch', ['sass', 'javascript'], function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});
