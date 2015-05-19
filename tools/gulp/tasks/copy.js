var gulp = require('gulp'),
  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
  minify = require('gulp-minify-css'),
  plumber = require('gulp-plumber'),
  config = require('../config'),
  gzip = require('gulp-gzip'),
  handleErrors = require('../util/handleErrors');

gulp.task('copy', function() {
  gulp.src([config.sourceAssetsDir + 'js/lib/**'])
    .pipe(plumber())
    .pipe(gulp.dest(config.buildAssetsDir + 'js/lib/'));

  gulp.src([config.sourceAssetsDir + 'js/bootstrap.js'])
    .pipe(plumber())
    .pipe(gulp.dest(config.buildAssetsDir + 'js/'));

  gulp.src(config.sourceAssetsDir + 'js/bundle.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(config.buildAssetsDir + 'js/'));

  gulp.src(config.sourceAssetsDir + 'css/styles.css')
    .pipe(plumber())
    .pipe(minify())
    .pipe(gulp.dest(config.buildAssetsDir + 'css/'));

  gulp.src(config.sourceAssetsDir + 'fonts/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.buildAssetsDir + 'fonts/'));

  gulp.src(config.sourceAssetsDir + 'audio/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.buildAssetsDir + 'audio/'));

  gulp.src(config.sourceAssetsDir + 'img/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.buildAssetsDir + 'img/'));

  gulp.src(config.sourceDir + '*.html')
    .pipe(plumber())
    .pipe(gulp.dest(config.buildDir));

  gulp.src(config.sourceDir + '*.php')
    .pipe(plumber())
    .pipe(gulp.dest(config.buildDir));

});
