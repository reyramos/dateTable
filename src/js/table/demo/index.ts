/**
 * Created by ramor11 on 2/2/2017.
 */
"use strict";

import * as angular from "angular";
import {DemoComponent} from "./demo.component";

var app = angular.module("demo.queryBuilder", []);
app.component('demoComponent', new DemoComponent());
module.exports = app;
