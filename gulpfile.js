var gulp        = require('gulp');
var help        = require('gulp-help')(gulp);
var gutil       = require('gulp-util');
var connect     = require('gulp-connect');
var gulpif      = require('gulp-if');
var gulpIgnore  = require('gulp-ignore');
var ts          = require('gulp-type');
var tslint      = require('gulp-tslint-log');
//var concat      = require('gulp-concat');
var concat      = require('gulp-concat-sourcemap');
var tplCache    = require('gulp-angular-templatecache');
var ngAnnotate  = require('gulp-ng-annotate');
var jade        = require('gulp-jade');
var less        = require('gulp-less');
var jsdoc       = require('gulp-jsdoc');
var clean       = require('gulp-clean');
var todo        = require('gulp-todos');
//var notify      = require("gulp-notify");

var tsProject = ts.createProject({
  sourceMap: true,
  declarationFiles: false,
  noExternalResolve: true
});

gulp.task('clean', 'remove build cruft', function() {
  return gulp.src(['./build', './package'], {read: false}) // TODO: generates defs?
    .pipe(clean());
});

gulp.task('appJS', 'compile js', function() {
  // concatenate compiled .coffee files and js files
  // into build/app.js
  var tsResult = gulp.src([
      './app/**/*.ts'
      ,'./defs/**/*.d.ts'
      ,'!./app/**/*_test.ts'
    ])
    .pipe(ts(tsProject));
  tsResult.map.pipe(gulp.dest('./build'));
  tsResult.dts.pipe(gulp.dest('./defs'));
  return tsResult.js
    .pipe(ngAnnotate())
    .pipe(gulpIgnore(/_test.js$/))
    .pipe(gulp.dest('./build'))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('docs', 'generate jsdoc', function() {
  return gulp.src(['./build/**/*.js'])
    .pipe(jsdoc('docs/'));
});

gulp.task('package', 'copy everything to output folder'
  , ['appJS', 'templates', 'appCSS', 'libJS', 'libCSS','index']
  , function() {
    return gulp.src(['./build/bundle.js'
        ,'./build/app.css'
        ,'./build/lib.js'
        ,'./build/lib.css'
        ,'./build/templates.js'
        ,'./build/index.html'
      ])
      .pipe(gulp.dest('./package'));
});

gulp.task('testJS', 'compile tests', function() {
  return gulp.src([
      './app/**/*_test.ts'
      , './defs/**/*.d.ts'
    ])
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest('./build'))
});

gulp.task('tslint', 'run lint on typescript', function() {
  return gulp.src(['./app/**/*.ts',])
    .pipe(tslint());
});

gulp.task('templates', 'compile jade templates', function() {
  // combine compiled Jade and html template files into 
  // build/template.js
  return gulp.src(['!./app/index.jade', '!./app.index.html',
      './app/**/*.html', './app/**/*.jade'])
      .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
      .pipe(tplCache('templates.js',{standalone:true}))
      .pipe(gulp.dest('./build'))
});

gulp.task('appCSS', 'compile less files', function() {
  // concatenate compiled Less and CSS
  // into build/app.css
  return gulp
    .src([
      './app/**/*.less',
      './app/**/*.css'
    ])
    .pipe(
      gulpif(/[.]less$/,
        less({
          paths: [
            './bower_components/bootstrap/less'
          ]
        })
        .on('error', gutil.log))
    )
    .pipe(
      concat('app.css')
    )
    .pipe(
      gulp.dest('./build')
    )
});

gulp.task('libJS', 'generate lib.js', function() {
  // concatenate vendor JS into build/lib.js
  return gulp.src([
    './bower_components/lodash/dist/lodash.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap/dist/js/bootstrap.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/angular-resource/angular-resource.js',
    './bower_components/angular-strap/dist/angular-strap.min.js',
    './bower_components/angular-strap/dist/angular-strap.tpl.min.js',
    './bower_components/underscore.js'
    ]).pipe(concat('lib.js'))
      .pipe(gulp.dest('./build'));
});

gulp.task('libCSS', 'generate lib.css', function() {
  // concatenate vendor css into build/lib.css
  return gulp.src(['!./bower_components/**/*.min.css',
      './bower_components/**/*.css'])
      .pipe(concat('lib.css'))
      .pipe(gulp.dest('./build'));
});

gulp.task('index', 'generate index.html', function() {
  return gulp.src(['./app/index.jade', './app/index.html'])
    .pipe(gulpif(/[.]jade$/, jade().on('error', gutil.log)))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', 'watch files for changes and automatically rebuild', ['package'], function() {

  // reload connect server on built file change
  gulp.watch([
      'package/**/*.html',        
      'package/**/*.js',
      'package/**/*.css'        
  ], function(event) {
      return gulp.src(event.path)
          .pipe(connect.reload());
          //.pipe(notify('page reloaded due to change in: <%= file.relative %>'));
  });

  // watch files to build
  gulp.watch(['./app/**/*.ts', '!./app/**/*_test.ts', './app/**/*.js', '!./app/**/*_test.js'], ['tslint','appJS','package']);
  gulp.watch(['./app/**/*_test.ts', './app/**/*_test.js'], ['tslint','testJS','package']);
  gulp.watch(['!./app/index.jade', '!./app/index.html', './app/**/*.jade', './app/**/*.html'], ['templates','package']);
  gulp.watch(['./app/**/*.less', './app/**/*.css'], ['appCSS','package']);
  gulp.watch(['./app/index.jade', './app/index.html'], ['index','package']);
});

gulp.task('connect', 'start standalone server', ['package'], connect.server({
  root: ['package'],
  port: 9000,
  livereload: true
}));

gulp.task('dev', 'build and run standalone server'
  , [ 'tslint'
    , 'appJS'
    , 'testJS'
    , 'templates'
    , 'appCSS'
    , 'index'
    , 'libJS'
    , 'libCSS'
    , 'package'
    , 'connect'
    , 'watch']
);

gulp.task('default', false, ['help']);
