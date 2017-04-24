'use strict';


import * as angular from "angular";
import {RouteProvider} from "./routes";
import {Draggable} from "./table/component/draggable.directive";

require("css/styles.less");

export let app: any = angular.module('app', [
    'rx'
    , 'ui.router'
    , 'ngSanitize'
    , 'oc.lazyLoad'
    , require('./core').name
]);

app.directive('aDraggable', Draggable.factory());

app.config(['routeStateProvider', function (states) {
    return new RouteProvider(states);
}]);

