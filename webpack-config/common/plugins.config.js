const path = require('path');
const webpack = require('webpack');
const dirs = require('./dirs.config.js');


const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * 创建html文件
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 抽取CSS
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * 复制文件
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 /**
 * 判断当前运行脚本
 */
const currentTarget = process.env.npm_lifecycle_event;

let DEBUG = true;
let DEV_SERVER = true;

if (currentTarget === 'build') { //生产环境打包
    DEBUG = false;
    DEV_SERVER = false;
} else if (currentTarget === 'dev') { //开发环境打包
    DEBUG = true;
    DEV_SERVER = false;
} else if (currentTarget == "start") { //开发调试
    DEBUG = true;
    DEV_SERVER = true;
}

let plugins = [

    /**
     * 全局标识
     */
    new webpack.DefinePlugin({
        /**
         * 开发标识
         */
        __DEV__: DEBUG,

        /**
         * 代理标识
         */
        __DEVAPI__: DEV_SERVER ? "/mock/" : "''",

        node_modules_path: dirs.projectRootDir + '/node_modules'
    }),

    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: ()=>{
                return [
                    require('precss'),
                    require('autoprefixer')
                ];
            }
            //,
            // tslint: ()=>{
            //     return require("tslint.config")
            // }
        }
    }),

    /**
     * 抽取公共js
     */
    // new webpack.optimize.CommonsChunkPlugin(
    //     DEV_SERVER ? {name: "common", filename: "script/common.js"}: {names: ["common", "webpackAssets"]}
    // ),

    /**
     * 暴露模块声明到全局作用域
     */
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "_": "underscore"
    }),

    /**
     * 对依赖文件去重
     */
    // new webpack.optimize.DedupePlugin(),

    /**
     * 避免对未改动的js产生hash值
     */
    new webpack.optimize.OccurrenceOrderPlugin(true),

    /**
     * 发布前清空发布目录
     */
    new CleanWebpackPlugin(),

    /**
     * 提取css文件到单独的文件中
     */
    new ExtractTextPlugin(DEV_SERVER ? "css/[name].css" : "css/[name]-[chunkhash:8].css", {allChunks: true}),

    /**
     * 创建html文件
     */
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: dirs.srcDir + '/index.html',
        inject: 'true',
        chunks: ['common', 'index', 'webpackAssets'],
        chunksSortMode: 'auto'
    }),


];


module.exports = plugins;
