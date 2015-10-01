!function(){
'use strict';

var CSSNEXT_DIR = './src/css';
var JS_SRC_DIR = './src/js';
var CSS_RELEASE_DIR = './css';
var JS_RELEASE_DIR = './js';

var path = require('path');

var gulp = require('gulp');
var logger = require('gulp-logger');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var atImport = require('postcss-import');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');


// CSSのビルド
gulp.task('postcss', function() {
    gulp.src(path.join(CSSNEXT_DIR, 'sfstyle.css'), { base: CSSNEXT_DIR })
        .pipe(postcss([
            atImport(),
            require('postcss-mixins')(),
            require('postcss-nested')(),
            require('postcss-simple-vars')(),
            require('cssnext')(),
//            require('cssnano')(),
            autoprefixer({ browsers: ['last 2 versions'] })
        ]))
        .pipe(gulp.dest(CSS_RELEASE_DIR))
        .pipe(logger({ beforeEach: '[postcss] wrote: ' }));
});
	
// JSのビルド
gulp.task('js',function(){
    gulp.src(path.join(JS_SRC_DIR, '/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest('./js'));
});

// ウォッチ
gulp.task('default',['js','postcss'],function(){
    gulp.watch(CSSNEXT_DIR + '/**/*.css',['postcss']);
    gulp.watch(JS_SRC_DIR + '/**/*.js',['js']);
});
}();
