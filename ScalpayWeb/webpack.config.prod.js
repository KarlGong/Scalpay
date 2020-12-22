const path = require("path");
const srcPath = path.join(__dirname, "src");
const libPath = path.join(__dirname, "node_modules");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: [
        path.join(__dirname, "src/index")
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[chunkhash].js",
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: "single", // enable "runtime" chunk
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
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
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
                include: [srcPath, libPath]
            },
            {
                test: /\.(jpe?g|png|gif|ico|eot|ttf|woff)$/,
                use: [{
                    loader: "file-loader",
                    query: {
                        name: function (file) {
                            var path = require("path");
                            var dir = path.parse(file).dir.replace(/\\/g, "/").split("/src/")[1];
                            return dir + "/[name].[hash].[ext]";
                        },
                    }
                }],
                include: srcPath
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "@svgr/webpack",
                        options: {
                            babel: false,
                            icon: true,
                        },
                    },
                ],
            }
        ]
    }
};