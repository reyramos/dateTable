module.exports = function (app) {
	'use strict';


	app.run(['routeState', function (State) {
		var _class = [];
		State.OnStateChangeStart(function(to, from){
			var body = angular.element(document.body),
				_cName = to.name.replace(/\.?([A-Z])/g, function (x, y) {
					return "-" + y.toLowerCase()
				}).replace(/^_/, "");

			_class.forEach(function (_c) {
				body.removeClass(_c);
			});
			//remove all class
			_class.splice(0, _class.length);
			//replace whats in memory
			_class.push(_cName);
			angular.element(document.body).addClass(_cName); //body[0] !== document.body

		})
	}])
	/**
	 * @ngdoc service
	 * @name eqApp.provider:routeStateProvider
	 *
	 *
	 * @description
	 *
	 * Use `routeStateProvider` to inject|permission into eqApp during config

	 *
	 *
	 */
		.provider('routeState', routeInjector);

	routeInjector.$inject = ['$injector'];

	function routeInjector($injector) {

		var state = null,
			r = [],
			$stateProvider = $injector.get('$stateProvider', 'routeInjector'),
			$locationProvider = $injector.get('$locationProvider', 'routeInjector'),
			$urlRouterProvider = $injector.get('$urlRouterProvider', 'routeInjector');

		/**
		 * @ngdoc function
		 * @name eqApp.provider:routeStateProvider#inject
		 * @methodOf eqApp.provider:routeStateProvider
		 *
		 *
		 * @param {Array=} routes to inject for module
		 *
		 * @description
		 * Inject routes bases on uiRouter object tree
		 * @example

		 ```js
		 var routes = [
		 {
             name: 'modulelayout',
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
		this.inject = function (routes) {
			angular.forEach(routes, function (route) {
				var views = route.views || {};

				Object.keys(views).forEach(function (key) {
					var tem = views[key].templateUrl;
					if (tem) {
						views[key].templateUrl = angular.isArray(tem) ? tem.join('/').replace(/\/\//g, '/') : tem;
					}
				});

				route.data = Object.assign({}, route.data, {
					debug: location.search.split('debug=')[1] || location.hash.split('debug=')[1]
				});

				r.push(route);
				$stateProvider.state(route);
			});


			$urlRouterProvider.otherwise(function ($injector) {
				$injector.get('$state').transitionTo('root');
			});

			/**
			 * ## HTML5 pushState support
			 *
			 * This enables urls to be routed with HTML5 pushState so they appear in a
			 * '/someurl' format without a page refresh
			 *
			 * The server must support routing all urls to index.html as a catch-all for
			 * this to function properly,
			 *
			 * The alternative is to disable this which reverts to '#!/someurl'
			 * anchor-style urls.
			 */
			$locationProvider.html5Mode(false);

		};


		/**
		 * @ngdoc service
		 * @name eqApp.provider:routeState
		 *
		 * @requires $rootScope
		 * @requires $document
		 *
		 * @description
		 * Defines the state of the application rules and views
		 *
		 *
		 * @return {Object|Array} Reference to routeStateProvider injection and permission states
		 *
		 *
		 */

		this.$get = ['$rootScope', function ($rootScope) {


			return {
				OnStateChangeStart: function (fn) {
					var func = typeof fn === 'function' ? fn : function () {
					};
					$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
						func(toState, toParams, fromState, fromParams)
					});
				}
			};
		}];

	}
};
