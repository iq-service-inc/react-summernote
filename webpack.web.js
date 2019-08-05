const merge = require('webpack-merge'),
    common = require('./webpack.common.js'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin'),
    HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = merge(common, {
    mode: 'production',
    entry: ["@babel/polyfill", './src/start.js'],
    output: {
        path: __dirname + '/public/',
        filename: '[name].[chunkhash].js',
        publicPath: '/',
    },
    optimization: {
        minimizer: [
            new TerserPlugin()
        ],
        splitChunks: {
            minSize: 3000,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendors',
                    priority: 5,
                },
                modules: {
                    test: /[\\/]node_modules[\\/](react|react-dom|jquery|bootstrap|summernote)[\\/]/,
                    chunks: 'initial',
                    name: 'modules',
                    priority: 10,
                },
            },
        }
    },
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
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: `${__dirname}/www/index.html`,
            filename: "index.html",
            inject: "body"
        })
    ],
})