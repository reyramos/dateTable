var webpack = require('webpack');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';


module.exports = {
	devtool: 'inline-source-map',
	resolve: commonConfig.resolve,
	resolveLoader: commonConfig.resolveLoader,
	module: commonConfig.module,
	plugins: [
		new webpack.DefinePlugin({
			'WEBPACK_ENVIRONMENT': JSON.stringify(ENV),
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		}),
		new webpack.ProvidePlugin({
			"jQuery": "jquery",
			"$": "jquery",
			'window.$': 'jquery',
			'window.jQuery': 'jquery',
			"jquery": 'jquery',
			"UAParser": 'ua-parser-js/src/ua-parser.js'

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
