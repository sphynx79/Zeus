const merge = require("webpack-merge")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: true,
                            },
                        },
                        "postcss-loader",
                        "sass-loader",
                    ],
                }),
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
        new CleanWebpackPlugin(["dist/*.*"]),
        new ExtractTextPlugin({
            filename: getPath => {
                return getPath("css/[name].css")
            },
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
