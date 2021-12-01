const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.ts',
        rules: './src/pages/rules/rules.ts',
        automata: './src/pages/automata/automata.ts'

    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.txt$/,
                use: 'raw-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                // order of loaders matters
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    "postcss-loader"

                ],
            },

            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }

        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './public/index.html', minify: false, chunks: ['index'] }),
        new HtmlWebpackPlugin({
            template: './public/automata.html',
            minify: false,
            filename: 'automata.html',
            chunks: ['automata']
        }),
        new HtmlWebpackPlugin({
            template: './public/rules.html',
            minify: false,
            filename: 'rules.html',
            chunks: ['rules']
        }),
    ],
};














