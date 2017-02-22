/**
 * Created by reyra on 1/24/2017.
 */


"use strict";

class HomeCtrl {

    static $inject = ['$scope'];

    constructor(private $scope) {
    }


}
export class HomeComponent implements ng.IComponentOptions {
    public controller: any;
    public template: string;

    constructor() {
        this.template = require('./home.component.html');
        this.controller = HomeCtrl
    }
}
