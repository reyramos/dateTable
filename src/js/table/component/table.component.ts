import * as angular from "angular";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;

class TableCtrl implements ng.IComponentController {
    
    
    static $inject: Array<string> = ['$element', '$scope'];
    public reorder;
    
    private table;
    private thead;
    private tbody;
    private $selectedColumn;
    private $selectedColumnRows = [];
    private $predictedColumn;
    private headers: Array<any> = [];
    
    private columns;
    private $columns;
    
    private onUpdate;
    private $mousedown: boolean = false;
    private $mousemove: boolean = false;
    private $postLinkTimeout;
    private $digestTimeout;
    private $tableTimeout;
    private $aTableMoveBox;
    private $aPredictedBox;
    private pColumn;
    private $thCell: any;
    private $tbCell: any;
    private $thSpacer: any;
    
    
    constructor(private $element, private $scope: ng.IScope) {
        this.table = angular.element($element[0].querySelector("table"));
        this.thead = angular.element($element[0].querySelector("table > thead"));
        this.tbody = angular.element($element[0].querySelector("table > tbody"));
        this.$aPredictedBox = angular.element('<div class="a-table-predicted-box" draggable=""></div>');
        
    }
    
    $onInit() {
        let self: any = this;
        
        this.tbody.on('scroll', function (e) {
            self.thead[0].scrollLeft = this.scrollLeft;
        });
        
        if (this.reorder) {
            this.$element.append(this.$aPredictedBox);
            this.$aPredictedBox.css({
                display: 'none'
            });
        }
    }
    
    $doCheck() {
        clearTimeout(this.$postLinkTimeout);
        this.postSpacer();
        
        if (this.reorder && !angular.equals(this.$columns, this.columns)) {
            this.$columns = angular.copy(this.columns);
            this.RemoveWindowEvent();
            this.AttachEvents();
            
        }
    }
    
    $postLink() {
        let self: any = this;
        this.postSpacer();
        this.AttachEvents();
    }
    
    
    private AttachEvents() {
        let self: any = this;
        if (!this.reorder)return;
        self.headers = [];
        this.$tableTimeout = setTimeout(()=> {
            self.table.find("th").each(function (hIndex, header) {
                let head = angular.element(header);
                head.css({cursor: 'move'});
                self.headers.push(head);
                head.off("mousedown touchstart").on("mousedown touchstart", function (e) {
                    e.preventDefault();
                    self.$selectedColumn = angular.element(this);
                    self.selectColumn(this);
                }).off("mouseup touchend").on("mouseup touchend", function (e) {
                    self.MouseUp(e)
                })
                /*.on("mousemove touchmove", function (e) {
                 if (self.$mousedown)
                 console.log('inside column', e.target)
                 })*/
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
            if (self.$thSpacer)  self.$thSpacer.remove();
            if (offset) {
                let thRow = self.thead.find("tr:first-child()");
                self.$thSpacer = thRow[0].insertCell(thRow.children().length);
                self.$thSpacer.setAttribute("class", "eq-thead-spacer");
                self.$thSpacer.style.width = offset + 'px';
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
        this.$element.off("mousemove touchmove");
        this.$mousedown = false;
        
        if (this.$thCell)this.$thCell.remove();
        if (this.$tbCell)this.$tbCell.remove();
        if (this.$aTableMoveBox) this.$aTableMoveBox.remove();
        
        if (this.$selectedColumn)this.dropColumn(mEvent).then(()=> {
            this.SelectedCellClass(false);
            this.$selectedColumn = null;
        });
        
        this.$predictedColumn = null;
        this.$aTableMoveBox = null;
        this.pColumn = null;
        this.$thCell = null;
        this.$tbCell = null;
        
        this.$aPredictedBox.css({
            display: 'none'
        })
        
    }
    
    
    private dropColumn(e) {
        let self: any = this;
        let $target: any = this.$predictedColumn;
        let $column = this.$selectedColumn[0];
        if ($target.cellIndex > $column.cellIndex)
            $target = this.headers[$target.cellIndex - 1][0];
        
        clearTimeout(this.$digestTimeout);
        return new Promise((resolve)=> {
            let $e: any = {};
            if ($target) {
                Object.assign($e, {
                    fromColumn: $column,
                    toColumn  : $target,
                    fromIndex : $column.cellIndex,
                    toIndex   : $target.cellIndex,
                });
                
                
                if (self.columns) {
                    let from = angular.copy(self.columns[$e.fromIndex]);
                    //remove it from order
                    self.columns.splice($e.fromIndex, 1);
                    //push to new order
                    self.columns.splice($e.toIndex, 0, from);
                    Object.assign($e, {
                        columns: self.columns
                    });
                }
            }
            
            
            if (!angular.equals(this.$columns, this.columns))
                self.onUpdate({
                    $event: $e
                });
            
            
            try {
                (self.$scope as any).$apply();
            } catch (e) {
            }
            
            resolve($e);
        })
    }
    
    private RemoveWindowEvent() {
        let self: any = this;
        window.removeEventListener("mouseup", function (e) {
            self.MouseUp(e);
        });
        window.removeEventListener("touchend", function (e) {
            self.MouseUp(e);
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
    
    private SelectedCellClass(bool: boolean, name?: string) {
        
        let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
        
        let _class = name ? [] : ['selected-cell'];
        if (name)_class.push(name + "-cell");
        
        this.$selectedColumn[bool ? 'addClass' : 'removeClass'](_class.join(" "));
        this.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (i, cell) {
            angular.element(cell)[bool ? 'addClass' : 'removeClass'](_class.join(" "));
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
    
    private findCell(ele) {
        if (!ele)return false;
        
        if (['TH', 'TD'].indexOf(ele.nodeName) > -1) {
            return ele;
        } else {
            return this.findCell(ele.parentNode);
        }
        
    }
    
    
    private selectColumn(cEvent) {
        let self: any = this;
        if (!self.$selectedColumn)return;
        let $predictedColumn: any;
        let $direction: string | boolean;
        let totalDistance = 0;
        let lastSeenAt = 0;
        let pos = self.getPosition(cEvent);
        
        
        this.$element.off("mousemove touchmove mouseup touchend", function () {
            $predictedColumn = null;
            $direction = null;
        }).on("mousemove touchmove", (event) => {
            
            this.$mousedown = true;
            
            if (!this.$selectedColumn)return;
            let e = event.originalEvent || event;
            e.preventDefault();
            
            let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
            let dir = $direction || lastSeenAt > e.pageX ? false/*'next'*/ : lastSeenAt < e.pageX ? true/*'previous'*/ : false;
            
            
            if (pos && !this.$aTableMoveBox) {
                this.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable=""></div>');
                this.$aTableMoveBox.css({
                    width : this.$selectedColumn[0].clientWidth + 'px',
                    height: this.table[0].offsetWidth + 'px',
                    left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
                });
                
                let dragTable = this.createDraggableTable();
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
                
            } else if (self.$aTableMoveBox !== null) {
                if (lastSeenAt)totalDistance += e.pageX - lastSeenAt;
                lastSeenAt = e.pageX;
                let left = totalDistance + pos.left;
                self.$aTableMoveBox.css({
                    left: left,
                });
            }
            
            
            cellIndex = e.target.cellIndex;
            let ele = this.findCell(e.target);
            
            
            let predictedColumn: any;
            if (cellIndex > -1) {
                predictedColumn = this.headers[cellIndex][0];
                if (!angular.equals($predictedColumn, predictedColumn))$predictedColumn = predictedColumn;
            } else if (!angular.equals(this.$selectedColumn[0], $predictedColumn)) {
                $predictedColumn = $predictedColumn || this.$selectedColumn[0];
                this.insertTableColumn($predictedColumn);
                this.$predictedColumn = $predictedColumn
            }
            
            
        })
        
    }
    
    private insertTableColumn(column) {
        let self: any = this;
        
        if (!angular.equals(this.pColumn, column)) {
            if (this.$thCell)this.$thCell.remove();
            if (this.$tbCell)this.$tbCell.remove();
            
            this.pColumn = column;
            let cellPosition = column.cellIndex; // > -1 ? column.cellIndex : 0;
            let cellWidth = column.offsetWidth;
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
            this.$tbCell.rowSpan = rowCount;
            this.$tbCell.style.width = cellWidth + 'px';
            this.$tbCell.style.padding = '0px';
            this.$tbCell.style.margin = '0px';
            
            //create a span with no styles, since it will be the filler to set the width of the cell
            let thSpan = document.createElement("span");
            thSpan.setAttribute("class", "a-table-predicted-column");
            thSpan.style.padding = "0px";
            thSpan.style.margin = "0px";
            thSpan.style.width = cellWidth + 'px';
            
            //copy for the tbody
            let tbSpan = thSpan.cloneNode(true);
            
            this.$thCell.appendChild(thSpan);
            this.$tbCell.appendChild(tbSpan);
            
            this.$aPredictedBox.css({
                display: 'block',
                width  : this.$thCell.offsetWidth + 'px',
                left   : (this.$thCell.offsetLeft - this.tbody[0].scrollLeft) + 'px',
            });
            
        }
        
    }
    
    $onDestroy() {
        clearTimeout(this.$postLinkTimeout);
        clearTimeout(this.$digestTimeout);
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
            reorder : '<?'
        };
        
        
        this.controller = TableCtrl;
    }
}


// WEBPACK FOOTER //
// ./~/angular1-template-loader!./src/js/table/component/table.component.ts
