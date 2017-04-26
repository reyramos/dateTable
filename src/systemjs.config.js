/**
 * Created by ramor11 on 4/25/2017.
 */
/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */


(function (global) {
	System.config({
		packages: {
			"plugin-typescript": {
				"main": "plugin.js"
			},
			"typescript": {
				"main": "lib/typescript.js",
				"meta": {
					"lib/typescript.js": {
						"exports": "ts"
					}
				}
			},
			"rxjs": {
				"defaultExtension": 'js'
			},
			"js": {
				"defaultExtension": 'ts'
			}
		},
		paths: {
			// paths serve as alias
			'npm:': 'node_modules/',
			'bower:': 'bower_components/'
		},

		// create aliases
		// SystemJS Plugins, referenced with "moduleName!pluginName"
		map: {
			"plugin-typescript": "node_modules/plugin-typescript/lib/",
			"typescript": "npm:/typescript/",
			"angular": 'bower:angular/angular.js',
			'rxjs': 'npm:rxjs',
			'css': 'npm:systemjs-plugin-css/css.js',
			'text': 'npm:systemjs-plugin-text/text.js'

		},
		transpiler: "plugin-typescript",
		meta: {
			'*.css': {loader: 'css'},
			"./js/app.module.ts": {
				format: "esm",
				loader: "plugin-typescript"
			},
			'angular': {format: 'global', exports: 'angular'},
			'*.tpl': {
				loader: 'text'
			},
			'*.html': {
				loader: 'text'
			},
			'*.json': {
				loader: 'json'
			}
		},
		typescriptOptions: {
			"target": "es5",
			"module": "system"
		}
	});


	window.addEventListener('load', function () {
		System
			.import('js/app.module.ts')
			.then(null, console.error.bind(console));
	});

})(this);
