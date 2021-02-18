const webpack = require('webpack')
// 	HtmlWebpackPlugin = require('html-webpack-plugin'),
// 	CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

module.exports = {
	output: {
		path: __dirname + '/dist/',
		filename: '[name].[hash].js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.styl?/,
				use: [
					'style-loader',
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
				test: /\.(png|jpg|gif|mp4|ogg|woff|woff2|ttf|eot)$/,
				loader: 'file-loader',
				options: {
					limit: 10000
				}

			},
			{
				test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
				use: [
					'style-loader',  // 這個會後執行 (順序很重要)
					'css-loader' // 這個會先執行
				]
			}
		]
	},
	resolve: {
		alias: {
			Config: `${__dirname}/config.json`,
			'react-summernote': `${__dirname}`
		},
		extensions: ['.jsx', '.js', '.styl']
	},
	plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
			jQuery: "jquery",
			store: "store"
        })
    ],
};