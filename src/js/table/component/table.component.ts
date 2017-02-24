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
        this.thead = angular.element($element[0].querySelector("table > thead"));
        this.tbody = $element[0].querySelector("table > tbody");
        
        
    }
    
    $onInit() {
        let self: any = this;
        this.tbody.addEventListener('scroll', function (e) {
            self.thead[0].scrollLeft = this.scrollLeft;
        });
        
    }
    
    
    $doCheck() {
        clearTimeout(this.$postLinkTimeout);
        this.postSpace();
    }
    
    private postSpace() {
        let self: any = this;
        this.$postLinkTimeout = setTimeout(()=> {
            let offset = self.thead[0].clientWidth - self.tbody.clientWidth;
            let spacer = self.thead.find('.eq-thead-spacer');
            if (offset && !spacer.length) {
                console.log('spacer', spacer)
                spacer = document.createElement("td");
                (spacer as any).classList += 'eq-thead-spacer';
                this.thead[0].children[0].appendChild(spacer);
                spacer.style.width = offset + "px";
            }
            
            
        }, 0);
    }
    
    $postLink() {
        this.postSpace()
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
    }
}
