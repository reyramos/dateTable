import IQService = angular.IQService;
import {Range} from "./filter/range";
import {Core} from "./module";
import {LazyLoaderProvider} from "./providers/lazy-loader.provider";
import {RouteStateProvider} from "./providers/route-state.provider";


/**
 * Created by reyra on 1/26/2017.
 */


LazyLoaderProvider(Core);
RouteStateProvider(Core);

Core.filter('range', Range);

export let CoreModule = Core;

