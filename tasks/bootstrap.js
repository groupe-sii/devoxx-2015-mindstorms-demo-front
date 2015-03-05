var injectTasks = function(basePaths, tasks) {
    var i = 0,
        len = tasks.length,
        module = null;

    for (i; i < len; i++) {
        moduleTasks = require('./' + tasks[i])(basePaths);
    }
};

module.exports = function(basePaths) {
    injectTasks(basePaths, ['test', 'dev', 'release', 'lint']);
}
