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

gulp.task('externalScripts', [], function() {
  gulp.src([config.sourceAssetsDir + 'js/lib/**', '!' + config.sourceAssetsDir + 'js/lib/**/*.min.js'])
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.buildAssetsDir + 'js/lib/'));
});

gulp.task('scripts', [], function() {
  return doScripts(false);
});

gulp.task('watchScripts', [], function() {
  return doScripts(true);
});

var options = {},
  browserify_instance, bundler = null;

function doScripts(watch) {

  var tasks = config.sources.browserify.entryPoints.map(function(entry) {
    return browserify({ entries: [entry.entry] })
      .bundle()
      .on('error', function(err) {
        handleErrors.call(this, err);
      })
      .pipe(source(entry.dest))
      .pipe(gulp.dest(config.targets.browserify.bundleDir))
      .pipe(gulp.dest(config.buildAssetsDir + '/js'));
  });

  return es.merge.apply(null, tasks);

  // if(bundler === null) {
  //   options = {
  //     cache: {},      // required by watchify
  //     packageCache: {},  // required by watchify
  //     fullconfig: watch,  // required by watchify
  //     //
  //     entries: [config.sources.browserify.entryPoint],
  //     debug: watch
  //   };

  //   browserify_instance = browserify(config.sources.browserify.entryPoint, options);
  //   if(watch) {
  //     bundler = watchify(browserify_instance); // watchify instance wrapping a browserify instance
  //     bundler.on('update', rebundle);
  //   } else {
  //     bundler = browserify_instance; // browserify instance
  //   }
  // }

  // bundler = bundler.transform(handlebarsify);

  // function rebundle(ids) {
  //   if(!buildMode && watch) gulp.start('js-hint');
  //   if(ids && watch) gutil.log(gutil.colors.yellow('[ Browserify ] Rebundle: ', ids));
  //   return bundler.bundle()
  //     .on('error', function(err) {
  //       handleErrors.call(this, err);
  //     })
  //     .pipe(source(config.targets.browserify.bundleFileName))
  //     .pipe(gulp.dest(config.targets.browserify.bundleDir))
  //     .pipe(gulp.dest(config.buildAssetsDir + '/js'));
  // }
  // return rebundle();
}