const merge = require('webpack-merge'),
    common = require('./webpack.common.js'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin')
//TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist/',
        filename: '[name].js',
        library: 'summernote',
        libraryTarget: 'umd'
    },
    externals: [
        {
            react: 'react',
            'react-dom': 'react-dom',
            'prop-types': 'prop-types',
            jquery: 'jquery'
        }, 
        /bootstrap/,
        /summernote/
    ],
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
})