'use strict';

const browserify = require('browserify');
const babelify = require('babelify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const globby = require('globby');
const through = require('through2');
const webserver = require('gulp-webserver');

gulp.task('browserify', () => {
  const bundledStream = through();

  bundledStream
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'));
  globby(['./src/*.js']).then((entries) => {
    const b = browserify({
      entries: entries,
    });
    b.transform('babelify')
     .transform('browserify-shim')
     .bundle().pipe(bundledStream);
  }).catch((err) => {
    bundledStream.emit('error', err);
  });

  return bundledStream;
});

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['browserify'])
});
  
gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(webserver({
      host: '127.0.0.1',
      livereload: true
    })
  );
});

gulp.task('default', ['browserify', 'watch', 'webserver']);
