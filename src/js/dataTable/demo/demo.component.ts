/**
 * Created by ramor11 on 2/17/2017.
 */


import * as angular from "angular";


const PrettyJSON: any = require('./pretty-json');
require('pretty-json/css/pretty-json.css');


class DemoComponentCtrl implements ng.IComponentController {
    
    static $inject = ['$scope', '$element'];
    
    public filters: any;
    public fields: any;
    public output: string;
    private JSON_PRETTY;
    
    
    constructor(private $scope, private $element) {
        this.JSON_PRETTY = $element.find('#PRETTY_JSON');
        
    }
    
    $onInit() {
    }
    

 

    
}

export class DemoComponent implements ng.IComponentOptions {
    public template: any;
    public controller: any;
    
    
    constructor() {
        this.template = require('./index.sample.html');
        this.controller = DemoComponentCtrl;
    }
}


// WEBPACK FOOTER //
// ./~/angular1-template-loader!./src/js/queryBuilder/demo/demo.component.ts
