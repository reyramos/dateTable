/**
 * @author: @AngularClass
 */
var path = require('path');
var extend = require('util')._extend

// Helper functions
var ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
	return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
	return process.argv[1] && !!(/webpack-dev-server$/.exec(process.argv[1]));
}

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [ROOT].concat(args));
}

function checkNodeImport(context, request, cb) {
	if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
		cb(null, 'commonjs ' + request);
		return;
	}
	cb();
}

function getProxies(target, options) {

	var proxiesConfig = require(root("proxies.config.js"));
	var proxy = {};

	var host = proxiesConfig.routes.map(function (o) {
			return o.host === target;
		}),
		ctx = host.context ? host.context : [],
		context = proxiesConfig.context.concat(ctx);

	context.forEach(function (val) {
		proxy[val] = {
			target: target,
			secure: false,
			changeOrigin: true
		};

		Object.assign(proxy[val], options)
		console.log('proxy', proxy)

	});

	return proxy;
}




exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.checkNodeImport = checkNodeImport;
exports.getProxies = getProxies;
