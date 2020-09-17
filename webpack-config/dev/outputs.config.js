const dirs = require('../common/dirs.dev.config.js');

module.exports = {
    path: dirs.buildDir,
    publicPath: '/',
    filename:  'js/[name].js',
    chunkFilename: 'js/[name].js'
};
