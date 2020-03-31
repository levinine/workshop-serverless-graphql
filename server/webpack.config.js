const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    mode: 'production',
    watch: false,
    target: 'node',
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.mjs', '.js'],
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
};
