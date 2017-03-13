#!/usr/bin/env node
/* eslint-env es6, node, gulp */
'use strict';

let gulp = require('gulp');

let csso = require('gulp-csso');
let imagemin = require('gulp-imagemin');
let less = require('gulp-less');
let pug = require('gulp-pug');
let uglify = require('gulp-uglify');

gulp.task('views', () => gulp
  .src('views/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('build')));

gulp.task('less', () => gulp
  .src('less/*.less')
  .pipe(less())
  .pipe(csso())
  .pipe(gulp.dest('build')));

gulp.task('js', () => gulp
  .src('js/*.js')
  .pipe(uglify({ preserveComments: 'license' }))
  .pipe(gulp.dest('build')));

gulp.task('img', () => gulp
  .src('img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('build')));

gulp.task('default', [ 'views', 'less', 'js', 'img' ]);
