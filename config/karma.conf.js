var webpackConfig = require('./webpack.test');

module.exports = function (config) {
	var _config = {
		basePath: '.',

		frameworks: ['jasmine'],

		files: [
			{pattern: './config/karma-test-shim.js', watched: false},
			{pattern: './src/**/*.json', watched: true, served: true, included: false}
		],
		// list of files to exclude
		exclude: [],

		preprocessors: {
			'./config/karma-test-shim.js': ['webpack', 'sourcemap']
		},

		webpack: webpackConfig,

		webpackMiddleware: {
			stats: 'errors-only'
		},

		webpackServer: {
			noInfo: true,
			stats: {
				colors: true
			}
		},

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		client: {
			captureConsole: true
		},

		reporters: ['progress'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers
		browsers: ['Chrome'],
		// browsers: ['ChromeWithoutSecurity'],
		// customLaunchers: {
		// 	ChromeWithoutSecurity: {
		// 		base: 'Chrome',
		// 		flags: ['--disable-web-security']
		// 	}
		// },
		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true

	};

	config.set(_config);
};
