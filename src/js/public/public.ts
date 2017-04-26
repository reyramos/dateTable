/**
 * Created by reyra on 7/11/2016.
 */

"use strict";

import {module} from 'angular';


import {NavComponent} from "./components/nav.component";
import {HomeComponent} from "./components/home.component";
import {AboutComponent} from "./components/about.component";
import {ContactComponent} from "./components/contact.component";

export let app = module("app.public", []);


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
app.component('eqAbout', new AboutComponent());
app.component('eqContact', new ContactComponent());



