var path = require("path"),
	fs = require('fs');

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var userConfig = fs.existsSync('.user.config.js') ? require('./.user.config') : {
		devServer: {
			historyApiFallback: true,
			stats: 'minimal'
		}
	};


const ENV = process.env.NODE_ENV = process.env.ENV = 'development';


const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 9000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig.metadata, {
	host: HOST,
	port: PORT,
	ENV: ENV,
	HMR: HMR
});


module.exports = webpackMerge(commonConfig, {
	devtool: 'source-map',
	output: {
		chunkFilename: "[id].[chunkhash].js",
		path: '/'
	},
	stats: {
		colors: true,
		modules: true,
		reasons: true,
		errorDetails: true
	},
	plugins: [
		new ExtractTextPlugin({ filename: '[name].css', disable: true, allChunks: true }),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		})
	],
	devServer: {

		port: METADATA.port,
		host: METADATA.host,
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 500,
			poll: 1000
		},
		// outputPath: helpers.root('src'),
		stats: 'minimal'
	}
}, userConfig);
