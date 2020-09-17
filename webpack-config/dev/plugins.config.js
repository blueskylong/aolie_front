const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const path = require('path');
const dirs = require('../common/dirs.dev.config.js');
const pkg = require(path.resolve(dirs.projectRootDir, './package.json'));
const pluginsConfig = require('../common/plugins.config.js');

const devServerPath = 'http://' + pkg.config.devHost + ':' + pkg.config.devPort;

pluginsConfig.push(new webpack.DefinePlugin({
    DEBUG: true
}));

/**
 * 热替换
 */
pluginsConfig.push(new webpack.HotModuleReplacementPlugin({
    // multiStep: true
}));

// /**
//  * 打开浏览器
//  */
// pluginsConfig.push(new OpenBrowserPlugin({
//     url: devServerPath + '/index.html'
// }));

module.exports = pluginsConfig;
