const webpack = require('webpack');
const pluginsConfig = require('../common/plugins.config.js');

pluginsConfig.push(new webpack.DefinePlugin({
    DEBUG: false
}));


module.exports = pluginsConfig;
