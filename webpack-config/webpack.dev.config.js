module.exports = {
    devtool: 'source-map',
    devServer: require('./dev/server.config.js'),
    entry: require('./common/entries.config.js'),
    output: require('./dev/outputs.config.js'),
    module: require('./common/loaders.config.js'),
    resolve: require('./common/resolves.dev.config.js'),
    plugins: require('./dev/plugins.config.js')
};
