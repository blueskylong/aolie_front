const dirs = require('../common/dirs.config.js');

module.exports = {
    path: dirs.buildDir,
    publicPath: './',
    filename: 'js/[name]-[chunkhash:8].js',
    chunkFilename: 'js/[name]-[chunkhash:8].js'
};
