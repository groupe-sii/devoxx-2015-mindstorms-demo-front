'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence']
    });

module.exports = function(basePaths) {

    gulp.task('test-js', function() {
        //Fake src for correct sequencing pipeline
        return gulp.src('')
            .pipe($.run('intern-client config=test/intern-vanilla reporters=junit reporters=console reporters=lcov'));
    });

    gulp.task('test-functional', function() {
        //Fake src for correct sequencing pipeline
        return gulp.src('')
            .pipe($.run('intern-client config=test/intern-browser'));
    });

    gulp.task('test-functional-local', function() {
        //Fake src for correct sequencing pipeline
        return gulp.src('')
            .pipe($.run('intern-runner config=test/intern-browser.local'));
    });

    gulp.task('tests', function() {
        return $.runSequence(
            'test-js'
        );
    });
};
