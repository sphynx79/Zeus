const merge = require("webpack-merge")
const webpack = require("webpack")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const OptimizeJsPlugin = require("optimize-js-plugin")
const common = require("./webpack.common.js")
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = merge(common, {
    mode: "production",
    module: {
        noParse: /(mapbox-gl)\.js$/,
        rules: [
            {
                test: /(\.css|\.scss)$/,
                use: [
                    ExtractCssChunks.loader,
                    { loader: "css-loader", options: { sourceMap: false } },
                    { loader: "postcss-loader", options: { sourceMap: false } },
                    { loader: "sass-loader", options: { sourceMap: false } },
                ],
            },
        ],
    },
    optimization: {
        nodeEnv: "production",
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: "manifest",
        },
        minimizer: [
            new UglifyJSPlugin({
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    ecma: 8,
                    ie8: false,
                },
            }),
            new OptimizeJsPlugin({ sourceMap: false }),
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index_prod.html",
            filename: "./index.html",
            inject: false,
        }),
        new webpack.DefinePlugin({
            NEXT: JSON.stringify(process.env.next),
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: require("cssnano"),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                },
            canPrint: true,
        }),
        new CleanWebpackPlugin(["dist/*.*"]),
        new ExtractCssChunks({
            filename: "css/[name].css",
        }),
        new CompressionPlugin({
            // asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
})
