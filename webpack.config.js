var webpack = require('webpack'),
    path = require('path');

module.exports = function()
{
    var distPath = "tests";

    var config =
    {
        entry:
        {
            "dependencies":
            [
                "./karma-dependencies-shim"
            ]
        },
        output:
        {
            path: path.join(__dirname, distPath),
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        resolve:
        {
            extensions: ['.js'],
            alias:
            {
            }
        },
        module:
        {
            rules:
            [
            ]
        },
        plugins:
        [
            new webpack.DllPlugin(
            {
                path: path.join(__dirname, distPath + '/[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    };

    return config;
};