const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
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
                        fallback: "style-loader",
                        use: ["css-loader", "postcss-loader", "sass-loader"],
                    })
                ),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: getPath => {
                return getPath("css/[name].css")
            },
            allChunks: true,
        }),
    ],
})
