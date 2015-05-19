var gulp = require('gulp'),
  changed = require('gulp-changed'),
  config = require('../config'),
  handleErrors = require('../util/handleErrors');

gulp.task('images', function() {
  // gutil.log(gutil.colors.yellow('[ Images ]'));
  return gulp.src(config.sources.images.watchSource)
    .pipe(changed(config.targets.images.bundleDir))
    .pipe(gulp.dest(config.targets.images.bundleDir));
});
