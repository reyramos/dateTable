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
    private headers: Array<any> = [];
    
    private onUpdate;
    private $postLinkTimeout;
    private $tableTimeout;
    private $aTableMoveBox;
    private $aTableSelectedBox;
    
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
            this.$aTableSelectedBox.remove();
        }
        
        
        if (this.$column)this.dropColumn(mEvent).then(()=> {
            this.$column.removeClass('selected-cell');
            this.removeCellClass();
            this.$column = null;
        });
        
        this.$aTableMoveBox = null;
        this.$aTableSelectedBox = null;
        
        
    }
    
    private findParent(ele) {
        let parent = ele.parentNode;
        if (parent && parent.nodeName === 'TH') {
            return parent;
        } else if (parent) {
            return this.findParent(parent);
        }
    }
    
    private dropColumn(e) {
        let self: any = this;
        let target: any = self.findParent(e.target) || e.target;
        let $column = this.$column[0];
        return new Promise((resolve)=> {
            let $e = {
                fromColumn: $column,
                toColumn  : target || $column,
                fromIndex : $column.cellIndex,
                toIndex   : target.cellIndex,
            };
            
            self.onUpdate({
                $event: $e
            });
            
            resolve($e);
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
                self.headers.push(head);
                head.on("mousedown touchstart", function (e) {
                    e.preventDefault();
                    self.$column = angular.element(this);
                    self.selectColumn(this);
                })
                    .on("mouseup touchend", function (e) {
                        console.log('$postLink => mouseup');
                        self.MouseUp(e)
                    });
            });
            
            self.AddWindowEvent();
        }, 0);
        
    }
    
    private removeCellClass() {
        
        let cellIndex = (this.$column[0] as any).cellIndex;
        this.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (i, cell) {
            angular.element(cell).removeClass('selected-cell')
        });
    }
    
    
    private createDraggableTable = function () {
        let self: any = this;
        
        let table = angular.element("<table/>");
        let thead = angular.element("<thead/>");
        let tbody = angular.element("<tbody/>");
        let tr = angular.element("<tr/>");
        let th = angular.element("<th/>");
        table.addClass(this.table.attr("class"));
        
        this.$column.addClass('selected-cell');
        
        table.css({
            width : this.$column[0].clientWidth + 'px',
            height: this.table[0].clientHeight + 'px'
        });
        
        
        th.html(this.$column.html());
        tr.append(th);
        thead.append(tr);
        table.append(thead);
        table.append(tbody);
        return table;
    };
    
    private predictedColumn: any;
    
    private selectColumn(cEvent) {
        let self: any = this;
        let MouseEventTimeout: any;
        let identity: any;
        
        if (identity)identity.remove();
        if (!self.$column)return;
        
        var totalDistance = 0;
        var lastSeenAt = 0;
        
        this.table.off("mousemove touchmove mouseup touchend").on("mousemove touchmove", function (event) {
            clearTimeout(MouseEventTimeout);
            
            if (!self.$column)return;
            let e = event.originalEvent || event;
            e.preventDefault();
            
            
            // self.$column = angular.element(cEvent);
            let pos = self.getPosition(cEvent);
            let cellIndex = (self.$column[0] as any).cellIndex;
            if (pos && !self.$aTableMoveBox) {
                self.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable=""></div>');
                self.$aTableSelectedBox = angular.element('<div class="a-table-selected-box" draggable=""></div>');
                self.$aTableMoveBox.css({
                    width : self.$column[0].clientWidth + 'px',
                    height: self.table[0].clientHeight + 'px',
                    left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
                });
                
                self.$aTableSelectedBox.css({
                    width : self.$column[0].clientWidth + 'px',
                    height: self.table[0].clientHeight + 'px',
                    left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
                });
                
                let dragTable = self.createDraggableTable();
                
                self.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (cellIndex, cell) {
                    let tr = angular.element("<tr/>");
                    let td = angular.element("<td/>");
                    cell.classList += " selected-cell";
                    td.html(cell.innerHTML);
                    tr.append(td);
                    dragTable.find("tbody").append(tr);
                });
                
                self.$aTableMoveBox.append(dragTable);
                self.$element.append(self.$aTableMoveBox)
                self.$element.append(self.$aTableSelectedBox)
                
            }
            
            cellIndex = e.target.cellIndex;
            if (cellIndex > -1) {
                MouseEventTimeout = setTimeout(()=> {
                    
                    let predictedColumn = self.headers[cellIndex];
                    if (!angular.equals(self.predictedColumn, predictedColumn))self.predictedColumn = predictedColumn;
                    
                    let pos = self.getPosition(predictedColumn);
                    if (!identity)identity = angular.element('<div class="a-table-predicted-column" draggable=""></div>');
                    identity.css({
                        width : predictedColumn[0].clientWidth + 'px',
                        height: self.table[0].clientHeight + 'px',
                        left  : (pos.left + (cellIndex ? 1 : 0)) + 'px',
                        top   : pos.top + 'px'
                    });
                    
                    self.$element.append(identity);
                }, 2)
                
            }
            
            if (self.$aTableMoveBox !== null) {
                if (lastSeenAt)totalDistance += e.pageX - lastSeenAt;
                lastSeenAt = e.pageX;
                let left = totalDistance + self.$column[0].offsetLeft - (self.tbody.scrollLeft || 0);
                self.$aTableMoveBox.css({
                    left: left,
                });
            }
            
        }).on("mouseup touchend", function (event) {
            if (identity)identity.remove();
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
            onUpdate: '&',
            columns : '=?',
            rows    : '=?'
        };
        
        
        this.controller = TableCtrl;
    }
}
