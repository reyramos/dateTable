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
    
    
    isVisible(elem) {
        var table = document.querySelector("table");
        var tbody = document.querySelector("table > tbody");
        // console.log(table.clientWidth)
        // console.log(table.clientHeight)
        // console.log(tbody.scrollLeft)
        
        let rect = elem.getClientRects();
        let offset = -Math.abs(rect[0].width / 2);
        if (rect[0].left > offset && rect[0].left < table.clientWidth)
            console.log('getClientRects', elem, elem.getClientRects())
        // return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
    }
    
    testTable() {
        var table = document.querySelector("table");
        var thead = document.querySelector("table > thead");
        
        
        let th = thead.querySelectorAll('tr')[0].children;
        for (let i = 0; i < th.length; i++) {
            this.isVisible(th[i])
        }
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
