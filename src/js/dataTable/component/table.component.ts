import * as angular from "angular";


/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;

class TableCtrl implements ng.IComponentController {
    
    
    static $inject: Array<string> = ['$element', '$scope'];
    
    private thead;
    private tbody;
    private $postLinkTimeout;
    
    constructor(private $element, private $scope: ng.IScope) {
        this.thead = $element[0].querySelector("table > thead");
        this.tbody = $element[0].querySelector("table > tbody");
        
        
    }
    
    $onInit() {
        let self: any = this;
        this.tbody.addEventListener('scroll', function (e) {
            self.thead.scrollLeft = this.scrollLeft;
        });
    }
    
    
    $postLink() {
        let self: any = this;
        this.$postLinkTimeout = setTimeout(()=> {
            let offset = self.thead.clientWidth - self.tbody.clientWidth;
            var spacer = document.createElement("td");
            spacer.classList += 'eq-thead-spacer';
            this.thead.children[0].appendChild(spacer);
            spacer.style.width = offset + "px";
        }, 0);
    }
    
    $onDestroy() {
        clearTimeout(this.$postLinkTimeout);
    }
}


require('./table.less');

export class Table implements ng.IComponentOptions {
    public bindings: any;
    // public transclude: any = true;
    public template: any;
    public controller: any;
    
    
    constructor() {
        this.bindings = {
            onDelete: '&',
            onUpdate: '&'
        };
        
        
        this.controller = TableCtrl;
        // this.template = require('./table.component.html');
    }
}
