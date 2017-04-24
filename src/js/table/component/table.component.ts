import * as angular from "angular";

import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from "rxjs";
import {Observable} from "rxjs/Observable";
import {IController} from "./draggable.directive";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;

class TableCtrl implements ng.IComponentController, IController {
    
    
    static $inject: Array<string> = ['$element', '$scope'];
    
    public table;
    public thead;
    public tbody;
    public $selectedColumn;
    public $selectedColumnRows = [];
    public $predictedColumn;
    public headers: Array<any> = [];
    
    public columns;
    public $columns;
    
    
    public $postLinkTimeout;
    public $digestTimeout;
    public $tableTimeout;
    public $aPredictedBox;
    public $thSpacer: any;
    
    
    private $aTableMoveBox;
    // private pColumn;
    // private $thCell: any;
    // private $tbCell: any;
    
    public isDragging: boolean = false;
    
    
    constructor(private $element, private $scope: ng.IScope) {
        //the table
        this.table = $element[0].querySelector("table");
        //the head
        this.thead = $element[0].querySelector("table > thead");
        //the body
        this.tbody = $element[0].querySelector("table > tbody");
        
        //BOX THAT DISPLAYS THE PREDICTED MOVE
        this.$aPredictedBox = document.createElement("div");
        this.$aPredictedBox.className = "a-table-predicted-box";
        this.$aPredictedBox.setAttribute("draggable", "");
    }
    
    
    $onInit() {
        /**
         * Define event on tbody scroll
         */
        this.tbody.addEventListener('scroll', (e) => this.thead.scrollLeft = e.target.scrollLeft);
        
        /**
         * If model columns is added, then well looking into reorder the columns
         * append the predicted box that will define the moving column
         */
        if (this.columns) {
            this.$element.append(this.$aPredictedBox);
            this.$aPredictedBox.style.display = "none";
        }
    }
    
    private findCell(ele) {
        if (!ele)return false;
        
        if (['TH', 'TD'].indexOf(ele.nodeName) > -1) {
            return ele;
        } else {
            return this.findCell(ele.parentNode);
        }
        
    }
    
    //INPUT
    onMouseDrag(e) {
        if (!this.columns)return;
        
        
        let ui = e.ui;
        
        let pos = this.getPosition(ui.element);
        let cellIndex = ui.element[0].cellIndex;
        let dir = e.event.movementX > 0;
        // let offset = pos.left + ui.left + (dir ? ui.element[0].clientWidth : 0);
        // let predictedColumn = this.columns[dir ? cellIndex + 1 : cellIndex - 1] || false;
        
        this.$selectedColumn = ui.element;
        // console.log(this.findCell(e.event.target).cellIndex || cellIndex);
        console.log(dir);
        
        if (pos && !this.$aTableMoveBox) {
            this.$aTableMoveBox = angular.element('<div class="a-table-move-box"></div>');
            this.$aTableMoveBox.css({
                width : ui.element[0].clientWidth + 'px',
                height: this.table.offsetWidth + 'px',
                left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
            });
            
            let dragTable = this.createDraggableTable();
            dragTable.addClass('draggable');
            
            angular.element(this.table).find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (cellIndex, cell) {
                let tr = angular.element("<tr/>");
                let td = angular.element("<td/>");
                (cell as any).classList += " selected-cell";
                td.html(cell.innerHTML);
                tr.append(td);
                dragTable.find("tbody").append(tr);
            });
            
            this.$aTableMoveBox.append(dragTable);
            this.$element.append(this.$aTableMoveBox);
            
        } else if (this.$aTableMoveBox !== null) {
            this.$aTableMoveBox.css({
                left: (pos.left + ui.left) + 'px'
            });
        }
    }
    
    onMouseComplete(e) {
        if (!this.isDragging)return;
        if (this.$aTableMoveBox) this.$aTableMoveBox.remove();
        
        this.SelectedCellClass(false);
        
        
        this.$selectedColumn = null;
        this.$aTableMoveBox = null;
        this.isDragging = false;
    }
    
    
    $doCheck() {
        clearTimeout(this.$postLinkTimeout);
        this.postSpacer();
        // if (!angular.equals(this.$columns, this.columns)) {
        //     this.$columns = this.columns;
        //     this.postSpacer();
        //
        //     //     this.RemoveWindowEvent();
        //     //     this.AttachEvents();
        //     //
        // }
    }
    
    $postLink() {
        this.postSpacer();
        //waiting for the digest to complete;
        // if (this.columns) this.$tableTimeout = setTimeout(() => {
        //     // this.AttachEvents()
        //     // this.CreateDrag();
        // }, 0);
    }
    
    
    /**
     * This is a spacer to place for the vertical bar width onto the hearder
     */
    private postSpacer() {
        // this.$postLinkTimeout = setTimeout(() => {
        let thRow = this.thead.getElementsByTagName("tr")[0];
        let lastChild = thRow.children[thRow.children.length - 1];
        
        let offset = this.thead.clientWidth - this.tbody.clientWidth;
        if (this.$thSpacer) {
            this.$thSpacer.remove();
            lastChild.className.replace(/a-row-last/g, '');
        }
        if (offset) {
            lastChild.className += " a-row-last";
            
            this.$thSpacer = (thRow as any).insertCell(thRow.children.length);
            this.$thSpacer.setAttribute("class", "eq-thead-spacer");
            this.$thSpacer.style.width = offset + 'px';
        }
        // }, 0);
    }
    
    
    public getPosition(ele) {
        let rect = null;
        let pT = null;
        try {
            rect = (ele[0] || ele).getBoundingClientRect();
            pT = (this.$element[0] || this.$element).getBoundingClientRect();
        } catch (e) {
        }
        
        var rT = rect.top + window.pageYOffset - pT.top,
            rL = rect.left + window.pageXOffset - pT.left;
        
        return {top: rT, left: rL};
    }
    
    
    //
    // private MouseUp(e) {
    //
    //     let mEvent = e.originalEvent || e;
    //     this.$element.off("mousemove touchmove");
    //     this.$mousedown = false;
    //
    //     if (this.$thCell) this.$thCell.remove();
    //     if (this.$tbCell) this.$tbCell.remove();
    //     if (this.$aTableMoveBox) this.$aTableMoveBox.remove();
    //
    //     if (this.$selectedColumn) this.dropColumn(mEvent).then(() => {
    //         this.SelectedCellClass(false);
    //         this.$selectedColumn = null;
    //     });
    //
    //     this.$predictedColumn = null;
    //     this.$aTableMoveBox = null;
    //     this.pColumn = null;
    //     this.$thCell = null;
    //     this.$tbCell = null;
    //
    //     this.$aPredictedBox.css({
    //         display: 'none'
    //     })
    //
    // }
    //
    // private dropColumn(e) {
    //     let self: any = this;
    //     let $target: any = this.$predictedColumn;
    //     let $column = this.$selectedColumn[0];
    //
    //
    //     clearTimeout(this.$digestTimeout);
    //     return new Promise((resolve) => {
    //         let $e: any = {};
    //         if ($target) {
    //
    //             if ($target.cellIndex > $column.cellIndex)
    //                 $target = this.headers[$target.cellIndex - 1][0];
    //
    //             Object.assign($e, {
    //                 fromColumn: $column,
    //                 toColumn  : $target,
    //                 fromIndex : $column.cellIndex,
    //                 toIndex   : $target.cellIndex,
    //             });
    //
    //
    //             if (self.columns) {
    //                 let from = angular.copy(self.columns[$e.fromIndex]);
    //                 //remove it from order
    //                 self.columns.splice($e.fromIndex, 1);
    //                 //push to new order
    //                 self.columns.splice($e.toIndex, 0, from);
    //                 Object.assign($e, {
    //                     columns: self.columns
    //                 });
    //             }
    //         }
    //
    //
    //         if (!angular.equals(this.$columns, this.columns))
    //             self.onUpdate({
    //                 $event: $e
    //             });
    //
    //
    //         try {
    //             (self.$scope as any).$apply();
    //         } catch (e) {
    //         }
    //
    //         resolve($e);
    //     })
    // }
    
    
    private SelectedCellClass(bool: boolean, name?: string) {
        
        let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
        
        let _class = name ? [] : ['selected-cell', 'last-cell'];
        if (name) _class.push(name + "-cell");
        
        this.$selectedColumn[bool ? 'addClass' : 'removeClass'](_class.join(" "));
        angular.element(this.table).find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (i, cell) {
            angular.element(cell)[bool ? 'addClass' : 'removeClass'](_class.join(" "));
        });
    }
    
    private createDraggableTable = function () {
        let table = angular.element("<table/>");
        let thead = angular.element("<thead/>");
        let tbody = angular.element("<tbody/>");
        let tr = angular.element("<tr/>");
        let th = angular.element("<th/>");
        table.addClass(this.table.className);
        
        this.$selectedColumn.addClass('selected-cell');
        
        table.css({
            width : '100%',
            height: this.table.clientHeight + 'px'
        });
        
        
        th.html(this.$selectedColumn.html());
        tr.append(th);
        thead.append(tr);
        table.append(thead);
        table.append(tbody);
        return table;
    };
    
    
    $onDestroy() {
        // clearTimeout(this.$postLinkTimeout);
        // clearTimeout(this.$digestTimeout);
        // clearTimeout(this.$tableTimeout);
        // this.RemoveWindowEvent();
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
            columns : '=?'
        };
        
        
        this.controller = TableCtrl;
    }
}
