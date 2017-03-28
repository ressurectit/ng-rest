var webpack = require('webpack');
var path = require('path');
var projectName = require('./package.json').name.replace("@anglr/", "").replace("-", "");

module.exports = function(options)
{
    var config =
    {
        entry: './dist/index.js',
        output:
        {
            path: path.join(__dirname, './dist'),
            filename: 'index.dev.js',
            library: projectName,
            libraryTarget: "umd"
        },
        externals:
        [
            "numeral",
            "jquery-param",
            "crypto-js",
            /^@angular\/.*$/,
            /^@ng\/.*$/,
            /^rxjs\/.*$/
        ],
        plugins: []
    };

    if(options && options.minify)
    {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin(
        {
            compress: true,
            mangle: true,
            sourceMap: false
        }));

        config.output.filename = "index.min.js";
    }

    return config;
};