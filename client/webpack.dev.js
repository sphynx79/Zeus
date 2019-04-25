const { resolve } = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const fs = require("fs")

if (process.env.ssl) {
    var serverport = 9000
    var port = 2015
    var https = { key: fs.readFileSync("localhost.key"), cert: fs.readFileSync("localhost.crt") }
} else {
    var serverport = 9001
    var port = 9292
    var https = false
}

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        stats: "errors-only",
        // contentBase: "./dist",
        hot: true,
        port: serverport,
        historyApiFallback: true,
        https: https,
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
                        loader: ExtractCssChunks.loader,
                        options: {
                            hot: true,
                            reloadAll: false,
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "./index.html",
            // favicon: './images/favicon.png',
            // inject: true,
        }),
        new webpack.DefinePlugin({
            NEXT: JSON.stringify(process.env.next),
            PORTDEV: JSON.stringify(port),
        }),
        new webpack.WatchIgnorePlugin([resolve(__dirname, "node_modules")]),
        new ExtractCssChunks({
            filename: "css/[name].css",
            hot: true,
        }),
    ],
})
