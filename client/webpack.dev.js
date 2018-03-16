const merge             = require('webpack-merge');
const common            = require('./webpack.common.js');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Jarvis            = require('webpack-jarvis');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        contentBase: './dist',
        port: 3000,
        proxy: {
            '/api': 'http://localhost:3001',
        },
        /*overlay: {
            errors: true,
            warnings: true,
        },*/
    },
    module: {
        rules: [{
            test: /(\.css|\.scss)$/,
            use: [{
                loader: 'css-hot-loader',
            }].concat(ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
            })),
        }, 
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css');
            },
            allChunks: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally
        new webpack.NamedModulesPlugin(),
        new Jarvis({
            port: 1337, // optional: set a port
        }),
    ],
});
