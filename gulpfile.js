var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('sass', function() {
  return gulp.src('source/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('watch', function() {
  return gulp.watch('source/scss/*.scss', ['sass']);
});