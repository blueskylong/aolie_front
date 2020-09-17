const path = require('path');
const dirs = require('./dirs.config');
module.exports = {
    alias: {
        baseRootDir: dirs.baseRootDir,
        projectRootDir: dirs.projectRootDir,
        srcDir: dirs.srcDir,
        buildDir: dirs.buildDir
    },
    extensions: ['.ts', '.tsx', '.js']
};
