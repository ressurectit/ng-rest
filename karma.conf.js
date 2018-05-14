var path = require('path'),
    webpack = require('webpack');

module.exports = function(config)
{
    var distPath = "tests";

    config.set(
    {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '.',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: 
        [
            path.join(__dirname, distPath + '/dependencies.js'),
            'karma-test-shim.ts',
            'src/**/*.spec.ts'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors:
        {
            '**/*.ts': 'webpack'
        },

        mime: 
        {
            'text/x-typescript': ['ts']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'kjhtml'],

        webpack: 
        {
            output:
            {
                publicPath: '/dist/'
            },
            devtool: 'source-map',
            resolve:
            {
                extensions: ['.ts', '.js']
            },
            module:
            {
                rules:
                [
                    //file processing
                    {
                        test: /\.ts$/,
                        use: ['awesome-typescript-loader', 'angular2-template-loader']
                    },
                    {
                        test: /\.html$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.css$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader']
                    },
                    {
                        test: /\.(ttf|woff|woff2|eot|svg|png|jpeg|jpg|bmp|gif|icon|ico)$/,
                        loader: "file-loader"
                    }
                ]
            },
            plugins:
            [
                new webpack.DllReferencePlugin(
                {
                    context: __dirname,
                    manifest: require(path.join(__dirname, distPath + '/dependencies-manifest.json'))
                })
            ]
        },

        webpackMiddleware: 
        {
            // webpack-dev-middleware configuration
            stats: 'errors-only',
            publicPath: '/dist/'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS', 'Chrome'],
        browsers: ['PhantomJS', 'Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};