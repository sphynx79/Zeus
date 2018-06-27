const { resolve } = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

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
                    ExtractCssChunks.loader,
                    { loader: "css-loader", options: { sourceMap: true } },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            NEXT: JSON.stringify(process.env.next),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([resolve(__dirname, "node_modules")]),
        new ExtractCssChunks({
            filename: "css/[name].css",
            hot: true,
        }),
    ],
})
