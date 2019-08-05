const merge = require('webpack-merge'),
    webpack = require('webpack'),
    common = require('./webpack.common.js'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

module.exports = merge(common, {
    entry: './src/start.js',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 888,
        historyApiFallback: true,
        hot: true
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: `${__dirname}/www/index.html`,
            filename: 'index.html',
            inject: 'body',
        }),
        new CspHtmlWebpackPlugin({
            'default-src': "'self' *.imgur.com www.youtube.com data:",
            // 'base-uri': "'none'",
            'script-src': "'self'",
            // 'img-src':"'self' imgur.com",
        }, {
                enabled: false,
                hashingMethod: 'sha256',
                hashEnabled: {
                    'script-src': true,
                    'style-src': true
                },
                nonceEnabled: {
                    'script-src': true,
                    'style-src': true
                }
            }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
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
    }
})
