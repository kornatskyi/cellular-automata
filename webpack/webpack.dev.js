const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        rules: './src/pages/rules/rules.ts',
        automata: './src/pages/automata/automata.ts'

    },
    devtool: 'inline-source-map',
    devServer: {
        // Open the page in the browser
        // open: true,


        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 8080,
        host: '127.0.0.1',
        compress: true,
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist'),
        assetModuleFilename: "./images/[name].[hash].[ext]",


    },




})














