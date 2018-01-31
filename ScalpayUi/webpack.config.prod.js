const path = require("path");
const srcPath = path.join(__dirname, "src");
const libPath = path.join(__dirname, "node_modules");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        path.join(__dirname, "src/index")
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "main.js",
        // publicPath: "./"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "~": srcPath
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                include: srcPath
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                include: srcPath
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        query: {
                            "sourceMap": true,
                            "modifyVars": {
                                "@icon-url": "'/src/assets/fonts/antd-iconfont/iconfont'"
                            }
                        }
                    }],
                include: [srcPath, libPath]
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|ttf|woff)$/,
                use: [{
                    loader: "file-loader",
                    query: {
                        name: "[path][name].[ext]",
                    }
                }],
                include: srcPath
            }
        ]
    }
};