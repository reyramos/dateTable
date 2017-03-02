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
    private $selectedColumn;
    private $selectedColumnRows: Array<any> = [];
    private headers: Array<any> = [];
    
    private columns;
    private rows;
    
    //compare changes
    private $columns;
    private $rows;
    
    private onUpdate;
    private $postLinkTimeout;
    private $tableTimeout;
    private $aTableMoveBox;
    // private $aTableSelectedBox;
    private predictedColumn: any;
    private pColumn;
    
    constructor(private $element, private $scope: ng.IScope) {
        this.table = angular.element($element[0].querySelector("table"));
        this.thead = angular.element($element[0].querySelector("table > thead"));
        this.tbody = angular.element($element[0].querySelector("table > tbody"));
    }
    
    $onInit() {
        let self: any = this;
        this.tbody.on('scroll', function (e) {
            self.thead[0].scrollLeft = this.scrollLeft;
        });
    }
    
    $doCheck() {
        clearTimeout(this.$postLinkTimeout);
        /*
         Update the spacer if vertical scroll exist
         */
        this.postSpacer();
        //
        // if (!angular.equals(this.columns, this.$columns)) {
        //     this.$columns = angular.copy(this.columns);
        //     // console.log('columns', this.columns)
        // }
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
                    self.$selectedColumn = angular.element(this);
                    self.selectColumn(this);
                }).on("mouseup touchend", function (e) {
                    self.MouseUp(e)
                });
            });
            self.AddWindowEvent();
        }, 0);
        
    }
    
    /**
     * This is a spacer to place for the vertical bar width onto the hearder
     */
    private postSpacer() {
        let self: any = this;
        this.$postLinkTimeout = setTimeout(()=> {
            let offset = self.thead[0].clientWidth - self.tbody[0].clientWidth;
            let spacer = self.thead.find('.eq-thead-spacer');
            if (offset && !spacer.length) {
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
        this.table.off("mousemove touchmove");
        //
        // if (this.$aTableMoveBox) this.$aTableMoveBox.remove();
        // if (this.$selectedColumn)this.dropColumn(mEvent).then(()=> {
        //     // this.$selectedColumn.removeClass('selected-cell');
        //     if (this.$thCell)this.$thCell.remove();
        //     if (this.$tbCell)this.$tbCell.remove();
        //     // this.removeCellClass();
        //     this.$selectedColumn = null;
        // });
        //
        // this.$aTableMoveBox = null;
        // this.pColumn = null;
        // this.$thCell = null;
        // this.$tbCell = null;
        
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
        let $column = this.$selectedColumn[0];
        return new Promise((resolve)=> {
            
            let $e = {
                fromColumn: $column,
                toColumn  : target || $column,
                fromIndex : $column.cellIndex,
                toIndex   : target.cellIndex,
            };
            if (self.columns) {
                
                // let from = angular.copy(self.columns[$e.fromIndex]);
                //
                // self.columns.splice($e.toIndex + 1, 0, from);
                // self.columns.splice($e.fromIndex, 1);
                //
                // Object.assign($e, {
                //     newOrder: self.columns
                // });
            }
            
            
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
    
    private removeCellClass() {
        
        let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
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
        
        this.$selectedColumn.addClass('selected-cell');
        
        table.css({
            width : '100%',
            height: this.table[0].clientHeight + 'px'
        });
        
        
        th.html(this.$selectedColumn.html());
        tr.append(th);
        thead.append(tr);
        table.append(thead);
        table.append(tbody);
        return table;
    };
    
    private selectColumn(cEvent) {
        let self: any = this;
        let MouseEventTimeout: any;
        // let identity: any;
        //
        // if (identity)identity.remove();
        if (!self.$selectedColumn)return;
        
        var totalDistance = 0;
        var lastSeenAt = 0;
        var offset: number = 0;
    
        this.table.off("mousemove touchmove mouseup touchend").on("mousemove touchmove", function (event) {
            clearTimeout(MouseEventTimeout);
            
            if (!self.$selectedColumn)return;
            let e = event.originalEvent || event;
            e.preventDefault();
            
            
            // self.$selectedColumn = angular.element(cEvent);
            let pos = self.getPosition(cEvent);
            let cellIndex = (self.$selectedColumn[0] as any).cellIndex;
            if (pos && !self.$aTableMoveBox) {
                self.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable=""></div>');
                self.$aTableMoveBox.css({
                    width : self.$selectedColumn[0].clientWidth + 'px',
                    height: self.table[0].clientHeight + 'px',
                    left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
                });
                
                let dragTable = self.createDraggableTable();
                dragTable.addClass('draggable');
                
                self.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (cellIndex, cell) {
                    self.$selectedColumnRows.push(cell);
                    let tr = angular.element("<tr/>");
                    let td = angular.element("<td/>");
                    cell.classList += " selected-cell";
                    td.html(cell.innerHTML);
                    tr.append(td);
                    dragTable.find("tbody").append(tr);
                });
                
                self.$aTableMoveBox.append(dragTable);
                self.$element.append(self.$aTableMoveBox);
                
            }
            
            cellIndex = e.target.cellIndex;
            let predictedColumn: any;
            let nextSibling: any;
            if (cellIndex > -1) {
                MouseEventTimeout = setTimeout(()=> {
                    
                    predictedColumn = self.headers[cellIndex];
                    nextSibling = predictedColumn[0].nextElementSibling;
                    if (!angular.equals(self.predictedColumn, predictedColumn))self.predictedColumn = predictedColumn;
                    
                }, 2)
            }
            
            if (self.$aTableMoveBox !== null) {
                if (lastSeenAt)totalDistance += e.pageX - lastSeenAt;
                lastSeenAt = e.pageX;
                let left = totalDistance + (self.$selectedColumn[0].offsetLeft - offset) - (self.tbody[0].scrollLeft || 0);
                self.$aTableMoveBox.css({
                    left: left,
                });
            }
            
        }).on("mouseup touchend", function (event) {
            // if (identity)identity.remove();
        })
        
    }
    
    private $thCell: any;
    private $tbCell: any;
    
    private insertTableColumn(column) {
        let self: any = this;
        
        if (!angular.equals(this.pColumn, column)) {
            if (this.$thCell)this.$thCell.remove();
            if (this.$tbCell)this.$tbCell.remove();
            
            this.pColumn = column;
            let cellPosition = column[0].cellIndex;
            let cellWidth = column[0].innerWidth;
            let rowCount: string = <string> "" + self.table.find("tr").length;
            
            let thRow = this.thead.find("tr:first-child()");
            let tbRow = this.tbody.find("tr:first-child()");
            
            this.$thCell = thRow[0].insertCell(cellPosition);
            this.$thCell.setAttribute("class", "a-table-predicted-column");
            this.$thCell.style.width = cellWidth + 'px';
            this.$thCell.style.padding = '0px';
            this.$thCell.style.margin = '0px';
            
            
            this.$tbCell = tbRow[0].insertCell(cellPosition);
            this.$tbCell.setAttribute("class", "a-table-predicted-column");
            this.$tbCell.setAttribute('rowspan', rowCount);
            this.$tbCell.style.width = cellWidth + 'px';
            this.$tbCell.style.padding = '0px';
            this.$tbCell.style.margin = '0px';
            
            //create a span with no styles, since it will be the filler to set the width of the cell
            let thSpan = document.createElement("span");
            thSpan.setAttribute("class", "a-table-predicted-column");
            thSpan.style.padding = "0px;";
            thSpan.style.margin = "0px;";
            thSpan.style.width = cellWidth + 'px';
            
            //copy for the tbody
            let tbSpan = thSpan.cloneNode(true);
            
            this.$thCell.appendChild(thSpan);
            this.$tbCell.appendChild(tbSpan);
            
        }
        
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
