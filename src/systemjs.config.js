/**
 * Created by ramor11 on 4/25/2017.
 */
/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */


(function (global) {
	System.config({
		transpiler: 'typescript',
		typescriptOptions: {
			emitDecoratorMetadata: true,
			experimentalDecorators: true
		},
		meta: {
			'npm:typescript/lib/typescript.js': {
				"exports": "ts"
			}
		},
		paths: {
			// paths serve as alias
			'npm:': 'node_modules/',
			'bower:': 'bower_components/',
		},
		map: {
			js: 'js',
			typescript: 'npm:typescript/lib/typescript.js',
			angular: 'bower:angular/angular.js',
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


	// 'ui.router'
	// 	, 'ngSanitize'
	// 	, 'oc.lazyLoad'
	System
		.import('js/app.module.ts')
		.then(null, console.error.bind(console));
})(this);
