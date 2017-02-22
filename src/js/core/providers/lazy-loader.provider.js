module.exports = function (app) {

	"use strict";

	/**
	 * @ngdoc service
	 * @name app.provider:lcpLazyLoaderProvider
	 *
	 * @description
	 *
	 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
	 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
	 * would need to be added into an angular module and delivered to the UI.
	 *
	 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
	 * main module.
	 *
	 */

	app
		.run(['lcpLazyLoader', function (Loader) {

			var _class = [];

			Loader.OnStateChangeStart(function (modules, to) {

				var body = angular.element(document.body),
					setClass = function (state, name) {
						if (!name)return;
						var _name = name.replace(/\./g, '_');
						_class.push(_name);
						body[state](_name);

					};

				_class.forEach(function (_c) {
					body.removeClass(_c);
				});

				//remove all class
				_class.splice(0, _class.length);

				setClass('addClass', modules.join(' '));
				setClass('addClass', to);

			});
		}])
		.provider('lcpLazyLoader', LazyLoaderConfig)
		.provider('jsBundleResolver', BundleResolver);

	function LazyLoaderConfig() {
		app.register = angular.noop;


		this.currentModule = [];

		/**
		 * @ngdoc service
		 * @name app.lcpLazyLoader
		 *
		 * @requires $document
		 * @requires $ocLazyLoad
		 *
		 * @description
		 *
		 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
		 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
		 * would need to be added into an angular module and delivered to the UI.
		 *
		 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
		 * main module.
		 *
		 */


		this.$get = ['$document', '$ocLazyLoad', '$transitions', function ($document, $ocLazyLoad, $transitions) {
			var _this = this;

			/**
			 * @ngdoc function
			 * @name app.lcpLazyLoader#register
			 * @methodOf app.lcpLazyLoader
			 *
			 * @description
			 *
			 *
			 */


			app.register = function (module) {

				this.currentModule = [];


				//if the module has dependencies, recursively include those dependencies
				module.requires.forEach(function (moduleName) {
					_this.currentModule.push(moduleName);
					$ocLazyLoad.inject(moduleName);
				});

				console.log('module._invokeQueue ---- ', module._invokeQueue.map(function (ary) {
					return ary[2][0]
				}));


				return $ocLazyLoad.load({name: module.name}).finally(function () {
					_this.currentModule.push(module.name);

				})
			};

			return {
				OnStateChangeStart: function (fn) {
					var func = typeof fn === 'function' ? fn : function () {
						};
					$transitions.onSuccess({to: '*'}, function (transition) {
						func(_this.currentModule, transition.$to().name)
					});
				}
			};
		}];

	}

	/**
	 * @ngdoc service
	 * @name app.provider:jsBundleResolverProvider
	 *
	 * @description
	 *
	 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
	 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
	 * would need to be added into an angular module and delivered to the UI.
	 *
	 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
	 * main module.
	 *
	 */


	function BundleResolver() {


		/**
		 * @ngdoc service
		 * @name app.provider:jsBundleResolver
		 *
		 * @requires $q
		 *
		 *
		 * @description
		 *
		 * Lazy Loads Angular modules and its components when the JS file is downloaded to the browser.
		 * Each JS file downloaded, on-demand is expected to be an AngularJS module. Any components (contrller, service, etc)
		 * would need to be added into an angular module and delivered to the UI.
		 *
		 * app.register will be called during 'resolve' method of 'ui-router' state to initialize the module into app
		 * main module.
		 *
		 * @example

		 ```js
		 var routes = [
		 {
             name: 'billinglayout',
             parent: 'dashboard',
             abstract: true,
             views: {
                 //code ...
             },
             resolve: {
                 jsBundleBilling: ['jsBundleResolver', function (jsBundleResolver) {
					//LazyLoad the necessary dependencies for billing.js module
                     return jsBundleResolver(function(app, resolve){
                         require.ensure([], function () {
                             app.register(require('./billing.js'));
                             resolve();
                         });
                     });
                 }]
             }
         }];

		 module.exports = routes;

		 ```
		 *
		 */


		this.$get = ['$q', function ($q) {


			var Bundler = function (callback) {
				var defer = $q.defer(),
					func = angular.isFunction(callback) ? callback : angular.noop;

				func.apply(this, [app, defer.resolve]);


				return defer.promise;

			};


			return Bundler;
		}];


	}

};
