/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');


module.exports = merge(common, {
    mode: 'production',
    entry: {
        index: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
    },

})














