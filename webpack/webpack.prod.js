const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');


module.exports = merge(common, {
    mode: 'production',
    entry: {
        index: './src/index.ts',
        rules: './src/pages/rules/rules.ts',
        automata: './src/pages/automata/automata.ts'

    },
    output: {
        // [contenthash] creates unique file name to prevent browser from storing old version of file in cache 
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '..', 'dist'),
    },

})














