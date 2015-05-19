var gulp = require('gulp'),
  connect = require('gulp-connect'),
  config = require('../config');

gulp.task('connect', function() {
  connect.server({
    root: config.buildDir,
    port: config.port,
    livereload: true,
    fallback: config.buildDir + 'index.html'
  });
});
