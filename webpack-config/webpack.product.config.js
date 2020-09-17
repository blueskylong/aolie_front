module.exports = {
    entry:   require('./common/entries.config.js'),
    output:  require('./product/outputs.config.js'),
    module:  require('./product/loaders.config.js'),
    resolve: require('./common/resolves.config.js'),
    plugins: require('./product/plugins.config.js')
};
