/**
 * Created by reyra on 1/24/2017.
 */


"use strict";
import template from './nav.component.html';

class NavCtrl {
    static $inject = ['$element'];

    constructor(protected $element) {
        $element.addClass('navbar navbar-default navbar-fixed-top').css({position: 'relative'});
    }
}

export class NavComponent implements ng.IComponentOptions {
    public controller: any;
    public template: string;

    constructor() {
        this.template = template;
        this.controller = NavCtrl;
    }
}
