import * as angular from "angular";
// require('./jquery-ui.min');
// require('./anterec');
// require('dragtable/jquery.dragtable');
// require('dragtable/dragtable.css');
/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;

class TableCtrl implements ng.IComponentController {
    
    
    static $inject: Array<string> = ['$element', '$scope'];
    private table;
    private thead;
    private tbody;
    private $column;
    
    private $postLinkTimeout;
    private $tableTimeout;
    private $aTableMoveBox;
    
    
    constructor(private $element, private $scope: ng.IScope) {
        this.table = angular.element($element[0].querySelector("table"));
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
        /*
         Update the spacer if vertical scroll exist
         */
        this.postSpacer();
    }
    
    /**
     * This is a spacer to place for the vertical bar width onto the hearder
     */
    private postSpacer() {
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
    
    private getPosition(ele) {
        let self: any = this;
        let rect = null;
        let pT = null;
        try {
            rect = (ele[0] || ele).getBoundingClientRect();
            pT = (self.$element[0] || self.$element).getBoundingClientRect();
        } catch (e) {
        }
        
        var rT = rect.top + window.pageYOffset - pT.top,
            rL = rect.left + window.pageXOffset - pT.left;
        
        return {top: rT, left: rL};
    }
    
    private MouseUp(e) {
        
        let mEvent = e.originalEvent || e;
        if (this.$aTableMoveBox) {
            this.table.off("mousemove touchmove");
            this.$aTableMoveBox.remove();
        }
        
        
        if (this.$column)this.dropColumn(mEvent).then(()=> {
            this.$column = null;
        });
        
        this.$aTableMoveBox = null;
        
        
    }
    
    
    private dropColumn(e) {
        let target = angular.element(e.target.parentNode);
        let $column = this.$column;
        return new Promise((resolve)=> {
            if (target)
                console.log('$column:e', target);
            // console.log('$column:drop', $column);
            console.log('$column:drop', $column[0].cellIndex);
            resolve();
        })
    }
    
    private RemoveWindowEvent() {
        let self: any = this;
        window.removeEventListener("mouseup", function (e) {
            self.MouseUp(e);
            console.log('window:mouseup', this)
            
        });
        window.removeEventListener("touchend", function (e) {
            self.MouseUp(e);
            console.log('window:touchend', this)
            
        });
    }
    
    private AddWindowEvent() {
        let self: any = this;
        window.addEventListener("mouseup", function (e) {
            self.MouseUp(e);
            self.RemoveWindowEvent();
        });
        window.addEventListener("touchend", function (e) {
            self.MouseUp(e);
            self.RemoveWindowEvent();
        });
    }
    
    $postLink() {
        let self: any = this;
        this.postSpacer();
        this.$tableTimeout = setTimeout(()=> {
            self.table.find("th").each(function (hIndex, header) {
                let head = angular.element(header);
                head.off("mousedown touchstart mouseup touchend")
                    .on("mousedown touchstart", function (e) {
                        self.$column = angular.element(this);
                        let pos = self.getPosition(this);
                        if (pos && !self.$aTableMoveBox) {
                            self.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable=""></div>');
                            self.$aTableMoveBox.css({
                                width : self.$column[0].clientWidth + 'px',
                                height: self.table[0].clientHeight + 'px',
                                left  : (pos.left + 1) + 'px',
                                top   : pos.top + 'px'
                            });
                            
                            self.$element.append(self.$aTableMoveBox)
                        }
                        
                        self.selectColumn(e.originalEvent || e);
                    })
                    .on("mouseup touchend", function (e) {
                        console.log('$postLink => mouseup');
                        self.MouseUp(e)
                    });
            });
            
            self.AddWindowEvent();
        }, 0);
        
    }
    
    
    private selectColumn(cEvent) {
        let self: any = this;
        if (!self.$column)return;
        this.table.on("mousemove touchmove", function (event) {
            let e = event.originalEvent || event;
            let target = angular.element(e.target.parentNode);
    
            e.preventDefault();
            
            if (self.$aTableMoveBox !== null) {
                console.log('target', target)
                self.$aTableMoveBox.css({
                    left: event.pageX - self.$column[0].clientWidth,
                });
            }
            
        })
        
    }
    
    
    $onDestroy() {
        clearTimeout(this.$postLinkTimeout);
        clearTimeout(this.$tableTimeout);
        this.RemoveWindowEvent();
    }
}


require('./table.less');

export class Table implements ng.IComponentOptions {
    public bindings: any;
    public template: any;
    public controller: any;
    
    
    constructor() {
        this.bindings = {
            onUpdate: '&'
        };
        
        
        this.controller = TableCtrl;
    }
}
