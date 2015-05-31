var gulp = require('gulp'),
  config = require('../config');

gulp.task('watch', ['watchScripts'], function() {
  // sass
  gulp.watch(config.sources.sass.watchSource, ['watchSass']);
  // images
  gulp.watch(config.sources.images.watchSource, ['images']);
  // html
  gulp.watch(config.sources.markup.watchSource, ['markup']);
});
