const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        // Runtime code for hot module replacement

    },
    devtool: 'inline-source-map',
    devServer: {
        // Open the page in the browser
        // open: true,


        // historyApiFallback: true,
        // compress: true,
        hot: true,
        port: 8080,
        host: '127.0.0.1',

    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist'),
        assetModuleFilename: "./images/[name].[hash].[ext]",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]




})














