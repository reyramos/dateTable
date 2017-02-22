/**
 * # Main Application bootstrap file
 *
 * Allows main Application to be bootloaded. This separate file is required in
 * order to properly isolate angular logic from requirejs module loading
 */
(function (angular) {
	'use strict';
	angular.bootstrap(document, ['app'], {
		// strictDi: true
	});
})(window.angular);
