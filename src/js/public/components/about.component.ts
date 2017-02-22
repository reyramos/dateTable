/**
 * Created by reyra on 1/24/2017.
 */


"use strict";

class AboutCtrl {

    static $inject = ['$scope'];

    constructor(private $scope) {
    }


}

export class AboutComponent implements ng.IComponentOptions {
    public controller: any;
    public template: string;

    constructor() {
        this.template = "About Page";
        this.controller = AboutCtrl
    }
}
