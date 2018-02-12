const {
    resolve,
} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    context: resolve(__dirname, 'src'),
    entry: [
        './pack/application.js',
    ],
    output: {
        path: resolve(__dirname, 'dist/'),
        filename: './js/[name]-bundle.js',
        chunkFilename: '.js/[name]-chunk.js',
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            components: resolve(__dirname, 'src/components')
        },
        // modules: [ resolve(__dirname, 'node_modules/') ]
    },
    module: {
        rules: [{
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                interpolate: true,
            },
        }, {
            test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                publicPath: '../', // override the default path
                outputPath: 'fonts/',
            },
        }, {
            test: /\.(png|jpg|svg|gif)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                publicPath: '../',
                outputPath: 'images/',
            },
        }, {
            test: /\.js$/,
            include: resolve(__dirname, 'src/'),
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {"targets": { "browsers": ["chrome >= 62", "ie >= 11", "firefox >= 56", "android >= 4.4" ]}, modules: false} ]],
                    plugins: ['module:mopt',
                        // [require('babel-plugin-transform-imports'), {
                        //     "carbon-components": {
                        //         "transform":  function(importName) {
                        //             var name = importName.toLowerCase()
                        //             return 'carbon-components/es/components/' + name + '/' + name + '.js' ;
                        //         },
                        //         "preventFullImport": true
                        //     }
                    // }]
            ],

            },
        }],
    }],
},
    plugins: [
        // new MomentLocalesPlugin({
        //     localesToKeep: ['it'],
        // }),

        new HtmlWebpackPlugin({
            template: './index.html',
            //favicon: './styles/images/favicon.png',
        }),
        new webpack.ProvidePlugin({
            m: 'mithril', //Global access
            PubSubEs6: 'pub-sub-es6',
            dispatch: ['pub-sub-es6', 'dispatch'],
            receive: ['pub-sub-es6', 'receive'],
            // on: ['pub-sub-es6', 'on']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
};
