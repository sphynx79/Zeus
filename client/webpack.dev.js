const { resolve } = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    // devtool: "source-map",
    devServer: {
        stats: "errors-only",
        // contentBase: "./dist",
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
                use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // Ignore node_modules so CPU usage with poll
        // watching drops significantly.
        new webpack.WatchIgnorePlugin([resolve(__dirname, "node_modules")]),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            allChunks: true,
        }),
    ],
})
