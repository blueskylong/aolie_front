const path = require('path');
const dirs = {};

dirs.baseRootDir = path.resolve(__dirname, '../'); // 原型根目录
dirs.projectRootDir = path.resolve(dirs.baseRootDir, '../'); //项目根目录
dirs.srcDir = path.resolve(dirs.projectRootDir, './src');//项目源码目录
dirs.buildDir = path.resolve(dirs.projectRootDir, './devbuild');//项目编译目录
dirs.vendorDir = path.resolve(dirs.projectRootDir, './vendor'); //第三方库目录
dirs.nodeModulesDir = path.resolve(dirs.projectRootDir, './node_modules'); //依赖库

module.exports = dirs;
