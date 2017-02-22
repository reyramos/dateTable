/**
 * Created by reyra on 1/9/2017.
 */
import * as angular from "angular";

"use strict";


export class InputCtrl {


    public require: boolean;
    public disabled: boolean;
    public $id: string;
    public label: string;
    public required: boolean;
    public datalist: any;
    public ngModel: any;
    public model: any;
    public name: any;
    protected _model: any;

    static $inject = ['utilities', '$element'];

    constructor(protected utilities, protected $element) {
        this.$id = this.utilities.getUniqueId();
        if (!this.required) this.required = false;
        if (!this.name) this.name = this.$id;
    }

    $onInit() {
        let self: any = this;
        this.datalist = this.utilities.getUniqueId();
        this.ngModel.$render = function () {
            self.model = this.$viewValue;
        };

    };


    $doCheck() {
        if (!angular.equals(this.model, this._model)) {
            this._model = angular.copy(this.model);
            this.ngModel.$setViewValue(this.model, 'change');
        }
    };

}

// @Component
export class Input implements ng.IComponentOptions {
    public bindings: any;
    public require: any;
    public controller: any;
    public template: string;

    constructor() {
        this.require = {
            ngModel: '^',
            form   : '^^'
        };

        this.bindings = {
            placeholder : '<',
            label       : '<',
            type        : '@',
            name        : '<',
            required    : '<',
            note        : '<',
            disabled    : '<',
            autocomplete: '='
        };

        this.template = require('./input.component.html');
        this.controller = InputCtrl;
    }
}
