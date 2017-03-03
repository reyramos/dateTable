/**
 * Created by ramor11 on 2/17/2017.
 */


import * as angular from "angular";


// const PrettyJSON: any = require('./pretty-json');
// require('pretty-json/css/pretty-json.css');


class DemoComponentCtrl implements ng.IComponentController {
    
    static $inject = ['$scope', '$element'];
    
    public test: any;
    
    
    public columns = [];
    public rows = [];
    
    constructor(private $scope, private $element) {
        this.test = $element.find('#test');
        let self: any = this;
        
        /**
         * Build some fake data
         */
        for (let i = 0; i < 10; i++) {
            let col_name = 'column_' + i;
            self.columns.push({
                name: col_name
            });
        }
        for (let i = 0; i < 100; i++) {
            let row = {};
            self.columns.forEach(function (o) {
                row[o.name] = "row_" + i + " (" + o.name + ")"
            });
            
            self.rows.push(row);
        }
        
        
    }
    
    $onInit() {
        let self: any = this;
        console.log('this', this)
    }
    
    
    TheHead(e, index) {
        e.preventDefault();
        e.stopPropagation();
        console.log('TheHead', index)
    }
    
    
    onColumnChange($e) {
        console.log('onColumnChange', $e)
    }
    
    
}

require('./style.less');

export class DemoComponent implements ng.IComponentOptions {
    public template: any;
    public controller: any;
    
    
    constructor() {
        this.template = require('./index.sample.html');
        this.controller = DemoComponentCtrl;
    }
}
