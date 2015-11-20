'use strict';

var gulp    = require('gulp'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint');

gulp.task('lint', function() {
return gulp.src(['./src/**/*.module.js', './src/**/*.js', '!./src/**/*.spec.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('connect-dev', function() {
  connect.server({
    root: __dirname,
    port: 8000,
    fallback: 'views/index.html'
  });
});

gulp.task('build', ['lint'], function(){
  return gulp.src(['./src/**/*.module.js', './src/**/*.js', '!./src/**/*.spec.js'])
    .pipe(concat('rockauth-angular.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['connect-dev']);
