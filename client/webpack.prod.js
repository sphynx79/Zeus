const merge = require("webpack-merge")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const OptimizeJsPlugin = require("optimize-js-plugin")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    mode: "production",
    devtool: "hidden-source-map",
    module: {
        noParse: /(mapbox-gl)\.js$/,
        rules: [
            {
                test: /(\.css|\.scss)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
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
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require("cssnano"),
                cssProcessorOptions: { discardComments: { removeAll: true } },
            }),
            new OptimizeJsPlugin({ sourceMap: false }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(["dist/*.*"]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            allChunks: true,
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
})
