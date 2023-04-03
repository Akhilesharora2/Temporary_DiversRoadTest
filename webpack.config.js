const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//to read version number
const webpack = require('webpack');
const fs = require('fs');
const version = fs.readFileSync('../server/public/version.txt').toString().trim();
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(version),
        }),
    ],
};

module.exports= {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

module.exports = {
    optimization:{
        minimizer: [
        new UglifyJSPlugin(),
    ],
},
};