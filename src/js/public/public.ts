/**
 * Created by reyra on 7/11/2016.
 */

"use strict";

import * as angular from "angular";


var app = angular.module("app.public", []);


/**
 * Include your controllers, services, and any additional angular module, into eq modules.
 *
 * @example
 *
 * ```js
 * require('./controllers/mymodulename.controller.js')(dataModule);
 * ```
 *
 * */

import {NavComponent} from "./components/nav.component";
import {HomeComponent} from "./components/home.component";
import {AboutComponent} from "./components/about.component";
import {ContactComponent} from "./components/contact.component";

app.component('eqNav', new NavComponent());
app.component('eqHome', new HomeComponent());
app.component('eqAbout', new AboutComponent());
app.component('eqContact', new ContactComponent());


module.exports = app;
