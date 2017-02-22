'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";
import {ProgressLinear} from "./progressLinear/progress-linear.component";

require("css/styles.less");

export let app: any = angular.module('app', [
    'ui.router'
    , 'ngSanitize'
    , 'oc.lazyLoad'
    , require('./core').name
]);


app.component('progressLinear', new ProgressLinear());

app.config(['routeStateProvider', function(states){
    return new RouteProvider(states);
}]);

