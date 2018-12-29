const { resolve } = require("path")

var webpack = require("webpack")

module.exports = {
    context: resolve(__dirname, "src"),
    // entry: ["regenerator-runtime/runtime", "./pack/application.js"],
    entry: ["./pack/application.js"],
    output: {
        path: resolve(__dirname, "dist/"),
        filename: "./js/[name]-bundle.js",
        chunkFilename: "js/[name]-bundle.js",
    },
    resolve: {
        extensions: [".js"],
        alias: {
            components: resolve(__dirname, "src/components"),
            // carbon_component: resolve(__dirname, "node_modules_custom/carbon-components/es/components"),
        },
        // modules: [ resolve(__dirname, 'node_modules/') ]
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true,
                            interpolate: true,
                        },
                    },
                ],
            },
            {
                test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    publicPath: "../fonts/", // override the default path
                    outputPath: "fonts/",
                    limit: 10 * 1024,
                },
            },
            {
                test: /\.(png|jpg|svg|gif|ico)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    publicPath: "../images/",
                    outputPath: "images/",
                },
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: "babel-loader",
            //         options: {
            //             presets: [
            //                 [
            //                     "@babel/preset-env",
            //                     {
            //                         targets: {
            //                             browsers: ["last 2 versions", "IE 10"],
            //                         },
            //                         modules: false,
            //                         debug: true,
            //                         // useBuiltins: "usage",
            //                         // exclude: ["transform-regenerator"],
            //                     },
            //                 ],
            //             ],
            //             plugins: ["module:mopt"],
            //         },
            //     },
            // },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            m: "mithril", //Global access
            noUiSlider: "nouislider",
            MainLoop: "mainloop.js",
            echarts: "echarts",
            dayjs: "dayjs",
            derive: ["derivable", "derive"],
            atom: ["derivable", "atom"],
            lens: ["derivable", "lens"],
            // PubSubEs6: 'pub-sub-es6',
            // dispatch: ['pub-sub-es6', 'dispatch'],
            // receive: ['pub-sub-es6', 'receive'],
            // on: ['pub-sub-es6', 'on']
        }),
    ],
}
