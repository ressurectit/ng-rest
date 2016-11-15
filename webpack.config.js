var webpack = require('webpack');
var projectName = require('./package.json').name.replace("@ng2/", "").replace("-", "");

module.exports = function(options)
{
    var config =
    {
        entry: './dist/index.js',
        output:
        {
            path: './dist',
            filename: 'index.dev.js',
            library: projectName,
            libraryTarget: "umd"
        },
        externals:
        [
            "jquery",
            "numeral",
            /^@angular\/.*$/,
            /^rxjs\/.*$/
        ],
        plugins: []
    };

    if(options && options.minify)
    {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin(
        {
            compress: true,
            mangle: false,
            sourceMap: false
        }));

        config.output.filename = "index.dev.min.js";
    }

    return config;
};