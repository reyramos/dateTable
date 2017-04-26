/**
 * Created by ramor11 on 4/25/2017.
 */
/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */

var System = require('system');

(function (global) {
	System.config({
		paths: {
			// paths serve as alias
			'npm:': 'node_modules/'
		},
		// map tells the System loader where to look for things
		map: {
			// our app is within the app folder
			app: 'src/js',

			// angular bundles
			'angular': 'npm:angular-sanitize',

			// other libraries
			'rxjs': 'npm:rxjs'
		},
		// packages tells the System loader how to load when no filename and/or no extension
		packages: {
			app: {
				defaultExtension: 'js'
			},

			rxjs: {
				defaultExtension: 'js'
			}
		}
	});

	/**
	 * require('es6-shim/es6-shim');

	 require('angular-ui-router/release/angular-ui-router');
	 require('angular-sanitize');
	 require('ocLazyLoad/dist/ocLazyLoad');
	 require('rx-angular');

	 */

})(this);
