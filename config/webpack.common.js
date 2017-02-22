var path = require("path");
var webpack = require("webpack");
var helpers = require("./helpers");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var projectRoot = path.dirname(__dirname);
var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
var CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;


/*
 * Webpack Constants
 */
var METADATA = {
	title: "Application Components",
	isDevServer: helpers.isWebpackDevServer()
};

module.exports = {
	context: projectRoot,
	cache: true,
	entry: {
		app: [
			helpers.root("src", "js", "app.module.ts"),
			helpers.root("src", "js", "bootstrap.js")
		],
		vendor: [helpers.root("src", "js", "vendor.js")]
	},
	output: {
		path: helpers.root("dist"),
		filename: "/[name].bundle.js"
	},
	stats: {
		colors: true,
		modules: true,
		reasons: true,
		errorDetails: true
	},
	recordsPath: helpers.root(".webpack.json"),
	resolveLoader: {
		modules: ["node_modules"],
		moduleExtensions: ["-loader"]
	},
	resolve: {
		// Make sure root is src
		modules: [
			helpers.root('src'),
			helpers.root('src', 'js'),
			helpers.root('node_modules'),
			helpers.root('bower_components')
		],
		extensions: [".ts", ".tsx", ".js", ".less", ".json", ".css", ".png", ".jpg"],
		alias: {
			angular: "angular",
			backbone: "backbone",
			underscore: "underscore/underscore",
			jquery: 'jquery/dist/jquery',
			rx: "rxjs/index"
		}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ["babel-loader","awesome-typescript-loader", "angular1-template-loader"],
				exclude: [/\.(spec|e2e|d)\.ts$/]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
						name: "[path][name].[ext]"
					}
				}
			},
			{
				test: /^(?!.*\.min\.css$).*\.css$/,
				exclude: helpers.root("src", "js"),
				use: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader?sourceMap"]})
			},
			{
				test: /\.less$/,
				exclude: helpers.root("src", "js"),
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader", "less-loader"]
				})

			},
			{
				test: /\.less$/,
				include: helpers.root("src", "js"),
				use: ["style-loader", "css-loader", "less-loader"]
			},
			{
				test: /\.scss$/,
				exclude: helpers.root("src", "js"),
				use: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader", "sass-loader"]})


			},
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader"},
			{
				test: /\.html$/,
				use: ["raw-loader", "html-minify"]
			},
			{
				test: /^index\.html$/, use: ["html", {
				loader: "file-loader", options: {name: "[path][name].[ext]"}
			}]
			},
			{
				test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: "file-loader",
					options: {
						mimetype: "application/font-woff",
						name: "[path][name].[ext]"
					}
				}]
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: "file-loader",
					options: {
						mimetype: "application/x-font-ttf",
						name: "[path][name].[ext]"
					}
				}]
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?\??$/,
				use: [{
					loader: "file-loader",
					options: {
						mimetype: "application/vnd.ms-fontobject",
						name: "[path][name].[ext]"
					}
				}]
			},
			{
				test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: "file-loader",
					options: {
						mimetype: "application/font-otf",
						name: "[path][name].[ext]"
					}
				}]
			},
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader"},
			{test: /\.worker/, use: "webworker-loader"}

		]
	},

	plugins: [
		new DirectoryNamedWebpackPlugin(),
		new webpack.LoaderOptionsPlugin({
			metadata: METADATA,
			progress: true,
			debug: true,
			test: /\.html$/,
			options: {
				"html-minify-loader": {
					empty: true,
					cdata: true,
					comments: false,
					dom: {                            		// options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
						lowerCaseAttributeNames: false     	// do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
					}
				}
			}
		}),
		new TsConfigPathsPlugin(),
		new CheckerPlugin(),
		// extractLESS,
		new webpack.IgnorePlugin(/spec\.js$/),
		new webpack.optimize.CommonsChunkPlugin({
			name: [
				"vendor",
				"app"
			].reverse()
		}),
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: Infinity,
			name: "common",
			filename: "common.js",
			sourceMapFilename: "common.map"
		}),
		new HtmlWebpackPlugin({
			// hash: true,
			baseUrl :"/",
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
				collapseBooleanAttributes: false,
				removeCommentsFromCDATA: true
			},
			template: helpers.root("src", "index.ejs"),
			filename: "index.html",
			chunksSortMode: "dependency"

		}),
		new webpack.ProvidePlugin({
			"$": "jquery",
			"jQuery": "jquery",
			"jquery": "jquery",
			'window.$': 'jquery',
			"window.jQuery": "jquery",
			"Rx": 'rx',
			"_": 'underscore',
			"Backbone": 'backbone'
		})
	],
	// target: "node",
	"externals": {
		"fs": "{}",
		"tls": "{}",
		"net": "{}",
		"console": "{}"
	},
	/*
	 * Include polyfills or mocks for various node stuff
	 * Description: Node configuration
	 *
	 * See: https://webpack.github.io/docs/configuration.html#node
	 */
	node: {
		fs: "empty",
		global: true,
		crypto: "empty",
		process: true,
		module: false,
		clearImmediate: false,
		setImmediate: false
	}


};
