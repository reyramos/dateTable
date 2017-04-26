/**
 * Created by reyra on 7/11/2016.
 */

"use strict";

import * as angular from "angular";


import {NavComponent} from "./components/nav.component";
import {HomeComponent} from "./components/home.component";

let app = angular.module("app.public", []);


/**
 * Include your controllers, services, and any additional angular module, into eq modules.
 *
 * @example
 *
 * ```js
 * require('./controllers/public.controller.js')(dataModule);
 * ```
 *
 * */



app.component('eqNav', new NavComponent());
app.component('eqHome', new HomeComponent());
export let PublicModule = app;

