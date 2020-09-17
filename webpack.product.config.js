const validate = require('webpack-validator');
const config = require('./webpack-config/webpack.product.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dirs = require('./webpack-config/common/dirs.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
config.module.rules.push({test: /\.json$/, loader: 'json'});

// 拷贝config.json文件。处理html模板文件
config.plugins.push(new CopyWebpackPlugin(
    {
        patterns: [
            {from: './config.json', to: './config.json'}
        ]
    }
));
config.optimization = {noEmitOnErrors: true, minimize: true};
config.plugins.push(
    new HtmlWebpackPlugin({
            filename: 'index.html',
            template: dirs.srcDir + '/index.html',
            inject: 'true',
            chunks: ['webpackAssets', 'vendor', 'vendor2', 'vendor3', 'common', 'index'],
            chunksSortMode: 'auto'
        }
    ));

module.exports = config;
