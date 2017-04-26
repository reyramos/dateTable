'use strict';


// import {module} from 'angular';
import * as angular from "angular";

import {RouteProvider} from "./routes";
import {Draggable} from "./table/component/draggable.directive";
import {CoreModule} from "./core/index";

import "../css/styles.css";

export let app: any = angular.module('app', [
    'ui.router'
    , 'ngSanitize'
    , 'oc.lazyLoad'
    , CoreModule.name
]);

app.directive('aDraggable', Draggable.factory());

app.config(['routeStateProvider', function (states) {
    return new RouteProvider(states);
}]);

