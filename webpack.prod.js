const merge = require('webpack-merge'),
    common = require('./webpack.common.js'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
            jquery: 'jquery',
            'rtf.js': 'rtf.js',
        }, 
        /bootstrap/,
        /summernote/
    ],
    module: {
        rules: [
            {
                test: /\.styl?/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')(),
                                require('cssnano')()
                            ]
                        }
                    },
                    {
                        loader: 'stylus-loader', options: { sourceMap: false }
                    }
                ]
            },
            {
                test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',  // 這個會後執行 (順序很重要)
                    'css-loader' // 這個會先執行
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].[hash].css',
        }),
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