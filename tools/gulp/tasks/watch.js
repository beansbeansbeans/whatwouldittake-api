var gulp = require('gulp'),
  config = require('../config');

gulp.task('watch', ['watchScripts'], function() {
  // js
  // added watchScripts dependency so it begins sychronously
  // external js
  gulp.watch(config.sources.browserify.watchSource, ['externalScripts']);
  // sass
  gulp.watch(config.sources.sass.watchSource, ['watchSass']);
  // images
  gulp.watch(config.sources.images.watchSource, ['images']);
  // html
  gulp.watch(config.sources.markup.watchSource, ['markup']);
});
