"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var table_component_1 = require("./component/table.component");
var app = angular.module("app.dataTable", []);
app.component('aTable', new table_component_1.Table());
module.exports = app;
//# sourceMappingURL=index.js.map