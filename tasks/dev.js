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

    // DOC

    gulp.task('clean-doc', function() {
        return $.del([
            basePaths.docs
        ], function(err, deletedFiles) {
            console.log('Docs files deleted');
        });
    });

    gulp.task('ng-doc', function() {
        var options = {
            startPage: '/accueil/accueil',
            html5Mode: false,
            bestMatch: true
        };

        return $.ngdocs.sections({
            code: {
                glob:[basePaths.src + 'js/**/*.js'],
                api: true,
                title: 'Code',
                startPage: '/code/qos-rcbi'
            },
            accueil: {
                glob: ['doc-src/*.ngdoc'],
                title: 'QOS RCBI Frontend Documentation'
            }
        }).pipe($.ngdocs.process(options)).pipe(gulp.dest(basePaths.docs));
    });

    gulp.task('archi-graph', function() {
        gulp.src(basePaths.src + 'js/**/*.js')
            .pipe($.angularArchitectureGraph({
                dest: basePaths.docs + 'img'
            }));
    });

    gulp.task('doc', function() {
        $.runSequence(
            //'clean-doc',
            'ng-doc'
            //'archi-graph'
        );
    });

    // WATCHER

    gulp.task('watch', function() {
        gulp.watch(basePaths.src + 'less/**/*.less', ['less']);
    });

    gulp.task('connect:src', function() {
        $.connect.server({
          root: 'src',
          port: 9000,
          livereload: true
        });
    });

    gulp.task('connect:dist', function() {
        $.connect.server({
          root: 'dist',
          port: 9000,
          livereload: true
        });
    });

    gulp.task('serve:src', ['connect:src', 'watch']);
    gulp.task('serve:dist', ['connect:dist', 'watch']);

};
