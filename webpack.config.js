const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.ts',
        automata: './src/automata.ts'

    },
    // watch: true,
    // watchOptions: {
    //     ignored: ['**/node_modules'],
    // },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        port: 8080,
        host: '127.0.0.1',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    mode: 'development',

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
                ],
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
            },
            //removed svg from regex , for some reason url-loader brokes svg import
            { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html', minify: false, chunks: ['index'] }),
        new HtmlWebpackPlugin({
            template: './public/automata.html',
            minify: false,
            filename: 'automata.html',
            chunks: ['automata']
        }),
        // new CopyWebpackPlugin({
        //     patterns: [{ from: 'src/assets', to: 'assets' }],
        // }),
    ],
};



// module.exports = [
//     // "eval",
//     // "eval-cheap-source-map",
//     // "eval-cheap-module-source-map",
//     // "eval-source-map",
//     // "cheap-source-map",
//     // "cheap-module-source-map",
//     // "inline-cheap-source-map",
//     // "inline-cheap-module-source-map",
//     "source-map",
//     // "inline-source-map",
//     // "hidden-source-map",
//     // "nosources-source-map"
// ].map(devtool => ({
//     mode: "development",
//     entry: {
//         index: './src/index.ts'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.tsx?$/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/,
//             },
//             {
//                 test: /\.txt$/,
//                 use: 'raw-loader',
//             },
//             {
//                 test: /\.s[ac]ss$/i,
//                 use: [
//                     // Creates `style` nodes from JS strings
//                     'style-loader',
//                     // Translates CSS into CommonJS
//                     'css-loader',
//                     // Compiles Sass to CSS
//                     'sass-loader',
//                 ],
//             },
//             {
//                 test: /\.css$/i,
//                 use: [
//                     // Creates `style` nodes from JS strings
//                     'style-loader',
//                     // Translates CSS into CommonJS
//                     'css-loader',
//                 ],
//             },
//             {
//                 test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//                 loader: 'file-loader',
//             },
//             //removed svg from regex , for some reason url-loader brokes svg import
//             { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader' },
//             { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' },
//         ],
//     },

//     output: {
//         path: path.join(__dirname, "dist"),
//         filename: `./[name]-${devtool}.js`,
//         clean: true,
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js'],
//     },
//     devtool,
//     optimization: {
//         runtimeChunk: true
//     },

//     plugins: [
//         new HtmlWebpackPlugin({ template: './public/index.html', minify: false, chunks: ['index'] }),
//         // new CopyWebpackPlugin({
//         //     patterns: [{ from: 'src/assets', to: 'assets' }],
//         // }),
//     ],
// }));
