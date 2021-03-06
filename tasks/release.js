'use strict';

var gulp = require('gulp'),
    plato = require('plato'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence', 'del', 'node-webkit-builder'],
        rename: {
            'gulp-angular-templatecache': 'templateCache',
            'gulp-ng-constant': 'ngConstant',
            'node-webkit-builder': 'nodeWebkitBuilder'
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

    gulp.task('ev3:config', function() {
        var _option = require('../config/ev3/config.json');
        return $.ngConstant({
                name: 'ev3Config',
                constants: _option,
                templatePath: 'config/tpls/constant.tpl.ejs',
                stream: true
            })
            .pipe(gulp.dest(basePaths.src + '/js'));
    });

    gulp.task('dist-clean', function() {
        return $.del([
            basePaths.dist
        ], function(err, deletedFiles) {
            console.log('Files deleted');
        });
    });

    gulp.task('dist-copy-resources', function() {
        return gulp.src([
                basePaths.src + 'assets/**/*'
            ])
            .pipe(gulp.dest(basePaths.dist + 'assets'));
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

    gulp.task('dist-zip', function() {
        return gulp.src(basePaths.dist + '**/*')
            .pipe($.zip('devoxx-2015-mindstorms.nw'))
            .pipe(gulp.dest(basePaths.dist));
    });

    gulp.task('dist-copy-nw-config', function() {
        return gulp.src([
                basePaths.src + 'package.json'
            ])
            .pipe(gulp.dest(basePaths.dist));
    });

    gulp.task('dist-nw', function() {
        var nw = new $.nodeWebkitBuilder({
            version: '0.12.0',
            files: [basePaths.dist + '**/*'],
            appName: 'devoxx-2015-mindstorms-demo',
            platforms: ['linux64']
        });

        nw.on('log', function(msg) {
            console.log('node-webkit-builder', msg);
        });

        return nw.build().catch(function(err) {
            console.log('node-webkit-builder', err);
        });
    });

    gulp.task('dist-nw-mp3-linux-fix', function() {
        return gulp.src('libffmpegsumo.so')
            .pipe(gulp.dest('build/devoxx-2015-mindstorms-demo/linux64/'));
    });

    gulp.task('build', function() {
        $.runSequence(
            'todo',
            'plato',
            'js-hint',
            'less-lint',
            'html-hint',
            'dist-clean',
            'dist-copy-resources',
            'dist-copy-resources-data',
            'less',
            'ev3:config',
            'dist-pre-inject',
            'dist-build-templates',
            'dist-inject',
            'dist-post-inject',
            'dist-clean-templates',
            'dist-clean-end',
            'dist-copy-nw-config',
            'dist-nw',
            'dist-nw-mp3-linux-fix'
        );
    });
};
