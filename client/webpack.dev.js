const { resolve } = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        stats: "errors-only",
        contentBase: "./dist",
        hot: true,
        port: 3000,
        // proxy: {
        //     '/api': 'http://localhost:3001',
        // },
        open: false,
        overlay: {
            errors: true,
            warnings: true,
        },
    },
    module: {
        rules: [
            {
                test: /(\.css|\.scss)$/,
                use: [
                    {
                        loader: "css-hot-loader",
                    },
                ].concat(
                    ExtractTextPlugin.extract({
                        fallback: { loader: "style-loader", options: { sourceMap: true } },
                        use: [{ loader: "css-loader", options: { sourceMap: true } }, { loader: "postcss-loader", options: { sourceMap: true } }, { loader: "sass-loader", options: { sourceMap: true } }],
                    })
                ),
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([resolve(__dirname, "node_modules")]),
        new ExtractTextPlugin({
            filename: getPath => {
                return getPath("css/[name].css")
            },
            allChunks: true,
        }),
    ],
})
