const path = require('path');
const dirs = require('./dirs.config.js');

module.exports = {
    index: [path.resolve(dirs.srcDir, 'index.ts')]
};