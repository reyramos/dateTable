var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var jasmineWebpackPlugin = require('jasmine-webpack-plugin');


const ENV = process.env.NODE_ENV = process.env.ENV = 'development';


module.exports = {
	devtool: 'inline-source-map',
	entry: {
		app: [
			helpers.root("src", "js", "app.module.ts"),
			helpers.root("src", "js", "bootstrap.js")
		],
		vendor: [helpers.root("src", "js", "vendor.js")]
	},
	resolve: commonConfig.resolve,
	resolveLoader: commonConfig.resolveLoader,
	module: commonConfig.module,

	plugins: [
		new JasmineWebpackPlugin(),
		new ExtractTextPlugin({filename: '[name].css', disable: true, allChunks: true}),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		}),
		new webpack.ProvidePlugin({
			"jQuery": "jquery",
			"$": "jquery",
			'window.$': 'jquery',
			'window.jQuery': 'jquery',
			"jquery": 'jquery'
		})
	],
	/*
	 * Include polyfills or mocks for various node stuff
	 * Description: Node configuration
	 *
	 * See: https://webpack.github.io/docs/configuration.html#node
	 */
	node: commonConfig.node
};
