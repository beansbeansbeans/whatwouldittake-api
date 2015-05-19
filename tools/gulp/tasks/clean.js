var gulp = require('gulp'),
  gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    config = require('../config'),
  handleErrors = require('../util/handleErrors');

gulp.task('clean', function() {
  var cleanTargets = [
    config.buildDir + '/*'
  ];
  return gulp.src(cleanTargets, { read: false })
    .pipe(clean());
});
