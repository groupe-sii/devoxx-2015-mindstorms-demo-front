'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'del', 'run-sequence'],
        rename: {
            'gulp-angular-architecture-graph': 'angularArchitectureGraph'
        }
    });

module.exports = function(basePaths) {

    // DEV

    gulp.task('less', function() {
        return gulp.src([
                basePaths.src + 'less/internal/internal.less',
                basePaths.src + 'less/external/external.less'
            ])
            .pipe($.less())
            .pipe(gulp.dest(basePaths.src + 'css'));
    });

    // WATCHER

    gulp.task('watch', function() {
        gulp.watch(basePaths.src + 'less/**/*.less', ['less']);
    });

    gulp.task('connect:src', function() {
        $.connect.server({
          root: 'src',
          port: 9090,
          livereload: true
        });
    });

    gulp.task('connect:dist', function() {
        $.connect.server({
          root: 'dist',
          port: 9090,
          livereload: true
        });
    });

    gulp.task('serve:src', ['connect:src', 'watch']);
    gulp.task('serve:dist', ['connect:dist', 'watch']);

};
