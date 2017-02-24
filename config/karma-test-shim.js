
Error.stackTraceLimit = Infinity;


//IMPORT ALL THE OF ANGULAR LIBRARIES
require('../src/js/vendor');
require('../bower_components/angular-mocks/angular-mocks.js');
require('../bower_components/jasmine-jquery/lib/jasmine-jquery.js');


// /**
//  * This is a Global injection for $log Provider, without it, it will
//  * throw error $delegate
//  */
//
// beforeEach(angular.mock.module('app', ['$provide', function ($provide) {
// 	/**
// 	 * The Decorator keeps throwing error which is something
// 	 * that would be needed within the test
// 	 */
// 	$provide.decorator('$log', [function () {
// 		return console;
// 	}]);
// }]));
//
// /**
//  * ./ROOT/COMPONENTS
//  * This will inject all necessary components into Karma test file for dependencies injection
//  * @param requireContext
//  * @returns {*}
//  */
//
// function requireAll(requireContext) {
// 	return requireContext.keys().map(requireContext);
// }
// // requires and returns all modules that match
// requireAll(require.context("../components/src", true, /[^\/]+\/*\.js$/g));


//LOADING ALL THE TEST WITHIN THE SRC DIRECTORY
var appContext = require.context('../src', true, /[^\/]+spec\/*\.ts$/g);
appContext.keys().forEach(appContext);


// //IMPORT THE APPLICATION ENTRIES
// require('../src/js/app.module');
// require('../src/js/bootstrap');
