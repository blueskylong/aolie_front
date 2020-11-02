const path = require('path');
const dirs = require('../common/dirs.config.js');
const pkg = require(path.resolve(dirs.projectRootDir, './package.json'));

const mockServerPath = 'http://' + pkg.config.mockHost + ':' + pkg.config.mockPort + '/';

module.exports = {
    contentBase: path.resolve(pkg.config.buildDir),
    historyApiFallback: true,
    hot: true,
    inline: true,
    noInfo: false,
    stats: {colors: true},
    host: pkg.config.devHost,
    port: pkg.config.devPort,
    proxy: {
        '/mock/*': {
            target: mockServerPath,
            secure: true,
            rewrite: function (req) {
                req.url = req.url.replace(/^\/dev-api/, '');
            }
        }
    }
};
