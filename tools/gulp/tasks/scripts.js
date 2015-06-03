var gulp = require('gulp');
var gutil = require('gulp-util');
var es = require('event-stream');
var browserify = require('browserify');
var browserifyHandlebars = require('browserify-handlebars');
var handlebarsify = require('hbsfy');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var config = require('../config');
var handleErrors = require('../util/handleErrors');
var babel = require('gulp-babel');
var babelify = require('babelify');
var parseArgs = require('minimist')(process.argv.slice(2));
var buildMode = (parseArgs['_'][0] === 'build') ? true : false;

gulp.task('js-hint', function() {
  var stream = gulp.src(config.sources.browserify.watchSource);

  stream.pipe(jshint({ globals: config.globals, browserify: true, newcap: false, devel: true }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', handleErrors);
});

gulp.task('scripts', [], function() {
  return doScripts(false);
});

gulp.task('watchScripts', [], function() {
  return doScripts(true);
});

var options = {},
  browserify_instance, bundler = null;

function createBundle(options) {
  var bundler, rebundle;

  bundler = browserify({
    entries: options.input
  }, {
    cache: {},
    packageCache: {},
    fullconfig: options.watching
  });

  if(options.watching) {
    bundler = watchify(bundler);
  }

  rebundle = function() {
    console.log("REBUNDLE");
    return bundler.bundle()
      .on('error', handleErrors)
      .pipe(source(options.output))
      .pipe(gulp.dest(config.buildAssetsDir + '/js'));
  };

  if(options.watching) {
    bundler.on('update', rebundle);
  }
  return rebundle();
}

function doScripts(watch) {

  return config.sources.browserify.entryPoints.forEach(function(entry) {
    return createBundle({
      watching: watch,
      input: entry.entry,
      output: entry.dest
    });
  });
}