/**
 * Created by reyra on 7/12/2016.
 */


"use strict";

import * as angular from "angular";
import {Table} from "./component/table.component";

var app = angular.module("app.dataTable", []);

app.component('aTable', new Table());


module.exports = app;
