'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*']
    });

module.exports = function(basePaths) {

    gulp.task('js-hint', function() {
        return gulp.src(basePaths.src + 'js/**/*.js')
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.jshint.reporter('fail'));
    });

    gulp.task('less-lint', function() {
        return gulp.src(basePaths.src + 'less/internal/internal.less')
            .pipe($.recess())
            .pipe($.recess.reporter())
            .pipe($.recess.reporter('fail'));
    });

    gulp.task('html-hint', function() {
        return gulp.src(basePaths.src + 'views/**/*.html')
            .pipe($.htmlhint({htmlhintrc: '.htmlhintrc'}))
            .pipe($.htmlhint.reporter())
            .pipe($.htmlhint.failReporter());
    });

}
