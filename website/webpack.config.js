const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require("copy-webpack-plugin");

const createPage = (pagePath, chunks = [], template = "./src/index.html") =>
    new HtmlWebpackPlugin({
        inject: 'body',
        chunks: chunks,
        template: template,
        filename: pagePath + '.html',
        publicPath: '/',
        minify: {
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            collapseWhitespace: true
        }
    })

module.exports = (_, mode) => {
    const isProduction = (typeof mode.env.production === "boolean" && mode.env.production);
    const generateProfile = (typeof mode.env.generateprofile === "boolean" && mode.env.generateprofile);

    return {
        entry: {
            main: "./src/index.ts",
        },
        mode: isProduction ? "production" : "development",
        output: {
            filename: '[name].js',
            chunkFilename: '[name].bundle.js',
            path: path.resolve(__dirname, '..', 'server', 'public'),
            clean: true
        },
        resolve: {
            extensions: [ ".js", ".ts" ]
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[hash:hex:5].[ext]',
                    }
                },
                {
                    test: /\.ts$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },
        devServer: {
            static: {
                directory: "./dist"
            },
            port: 9090,
            host: '0.0.0.0'
        },
        plugins: [
            ...(generateProfile ? [ new BundleAnalyzerPlugin() ] : []),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new CopyPlugin({
                patterns: [
                    // relative path is from src
                    { from: './src/imgs/favicon.ico' }, // <- your path to favicon
                ]
            }),
            createPage('index', [ 'main' ]),
        ],
        optimization: isProduction ? {
            minimize: true,
            minimizer: [ new TerserPlugin(), new CssMinimizerPlugin() ],
            splitChunks: {
                chunks: 'async',
                maxAsyncRequests: 30,
                maxInitialRequests: 30
            }
        } : undefined
    }
};