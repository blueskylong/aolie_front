const path = require('path');
const dirVars = require('./dirs.config');
module.exports = {


    // can specify a custom config file relative to current directory or with absolute path
    // 'tslint-custom.json'
    configFile: false,

    // tslint errors are displayed by default as warnings
    // set emitErrors to true to display them as errors
    emitErrors: true,

    // tslint does not interrupt the compilation by default
    // if you want any file with tslint errors to fail
    // set failOnHint to true
    failOnHint: true,

    // enables type checked rules like 'for-in-array'
    // uses tsconfig.json from current working directory
    typeCheck: true,

    // automatically fix linting errors
    fix: false,

    // can specify a custom tsconfig file relative to current directory or with absolute path
    // to be used with type checked rules
    tsConfigFile: path.resolve(dirVars.projectRootDir, './.tslint.json'),

    // name of your formatter (optional)
    // formatter: 'yourformatter',

    // path to directory containing formatter (optional)
    // formattersDirectory: 'node_modules/tslint-loader/formatters/',

    // These options are useful if you want to save output to files
    // for your continuous integration server
    fileOutput: {
        // The directory where each file's report is saved
        dir: './tslint-check/',

        // The extension to use for each report's filename. Defaults to 'txt'
        ext: 'xml',

        // If true, all files are removed from the report directory at the beginning of run
        clean: true,

        // A string to include at the top of every report file.
        // Useful for some report formats.
        header: '<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">',

        // A string to include at the bottom of every report file.
        // Useful for some report formats.
        footer: '</checkstyle>'
    }
};
