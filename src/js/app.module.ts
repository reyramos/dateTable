'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";

require("css/styles.less");

export let app: any = angular.module('app', [
    'ui.router'
    , 'ngSanitize'
    , 'oc.lazyLoad'
    , require('./core').name
]);



app.config(['routeStateProvider', function(states){
    return new RouteProvider(states);
}]);

