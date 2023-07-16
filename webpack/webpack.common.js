/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm

module.exports = {
    entry: {
        index: './src/index.ts',
        gameOfLife: './src/gameOfLife.ts',
        game: './src/game.ts'
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
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html', minify: false, chunks: ['index'] }),
        new HtmlWebpackPlugin({ 
            filename: 'gameOfLife.html',  // the output file in dist/ directory
            template: './src/gameOfLife.html', 
            minify: false, 
            chunks: ['gameOfLife']  // chunks is an array of entry points that this html file should include
        }),
        new HtmlWebpackPlugin({ 
            filename: 'game.html',  // the output file in dist/ directory
            template: './src/game.html', 
            minify: false, 
            chunks: ['game']  // chunks is an array of entry points that this html file should include
        }),
    ],
};














