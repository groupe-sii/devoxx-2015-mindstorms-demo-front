'use strict';

var gulp = require('gulp'),
    plato = require('plato'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence', 'del'],
        rename: {
            'gulp-angular-templatecache': 'templateCache'
        }
    });

module.exports = function(basePaths) {

    gulp.task('todo', function() {
        return gulp.src(basePaths.src + 'js/**/*.js')
            .pipe($.todo())
            .pipe(gulp.dest('./'));
    });

    gulp.task('plato', function() {
        return plato.inspect(basePaths.src + 'js/**/*.js', 'reports/plato/', {}, function() {});
    });

    gulp.task('dist-clean', function() {
        return $.del([
            basePaths.dist
        ], function(err, deletedFiles) {
            console.log('Files deleted');
        });
    });

    gulp.task('dist-copy-resources-img', function() {
        return gulp.src([
                basePaths.src + 'img/**/*'
            ])
            .pipe(gulp.dest(basePaths.dist + 'img'));
    });

    gulp.task('dist-copy-resources-data', function() {
        return gulp.src([
                basePaths.src + 'data/**/*'
            ])
            .pipe(gulp.dest(basePaths.dist + 'data'));
    });

    gulp.task('dist-pre-inject', function() {
        return gulp.src(basePaths.src + 'index.html')
            .pipe($.rename('index-tmp.html'))
            .pipe(gulp.dest(basePaths.src));
    });

    gulp.task('dist-build-templates', function() {
        return gulp.src(basePaths.src + 'views/**/*.html')
            .pipe($.templateCache('templates.js', {
                standalone: true,
                root: 'views/'
            }))
            .pipe(gulp.dest(basePaths.src + 'js'));
    });

    gulp.task('dist-inject', function() {
        var assets = $.useref.assets(),
            jsFilter = $.filter('**/*.js'),
            cssFilter = $.filter('**/*.css'),
            htmlFilter = $.filter('*.html');

        return gulp.src(basePaths.src + 'index-tmp.html')
            .pipe(assets)
            .pipe($.rev())

            .pipe(jsFilter)
            .pipe($.uglify())
            .pipe(jsFilter.restore())

            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())

            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())

            .pipe(htmlFilter)
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true,
                conditionals: true
            }))
            .pipe(htmlFilter.restore())

            .pipe(gulp.dest(basePaths.dist));
    });

    gulp.task('dist-post-inject', function() {
        return gulp.src(basePaths.dist + 'index-tmp.html')
            .pipe($.rename('index.html'))
            .pipe(gulp.dest(basePaths.dist));
    });

    gulp.task('dist-clean-templates', function() {
        return gulp.src(basePaths.src + 'js/templates-empty.js')
            .pipe($.rename('templates.js'))
            .pipe(gulp.dest(basePaths.src + 'js'));
    });

    gulp.task('dist-clean-end', function() {
        return $.del([
            basePaths.dist + 'index-tmp.html',
            basePaths.src + 'index-tmp.html'
        ], function(err, deletedFiles) {
            console.log('Files deleted');
        });
    });

    gulp.task('build', function() {
        $.runSequence(
            'todo',
            'plato',
            'js-hint',
            'less-lint',
            'html-hint',
            'dist-clean',
            'dist-copy-resources-img',
            'dist-copy-resources-data',
            'less',
            'dist-pre-inject',
            'dist-build-templates',
            'dist-inject',
            'dist-post-inject',
            'dist-clean-templates',
            'dist-clean-end'
        );
    });
};
