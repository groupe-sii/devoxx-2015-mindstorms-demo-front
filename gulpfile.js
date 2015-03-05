var gulp  = require('gulp'),

basePaths = {
    src: 'src/',
    dist: 'dist/',
    docs: 'docs/',
    bower: 'src/vendor/'
};

require('./tasks/bootstrap')(basePaths);

/**
 * DEFAULT
 */

gulp.task('default', function() {
    console.log('run');
});
