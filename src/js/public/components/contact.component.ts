/**
 * Created by reyra on 1/24/2017.
 */


"use strict";

class ContactCtrl {

    static $inject = ['$scope'];

    constructor(private $scope) {
    }


}

export class ContactComponent implements ng.IComponentOptions {
    public controller: any;
    public template: string;

    constructor() {
        this.template = "Contact Page";
        this.controller = ContactCtrl
    }
}
