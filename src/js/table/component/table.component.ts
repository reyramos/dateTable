import * as angular from "angular";
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
    public $selectedHTMLColumn: HTMLElement;
    public $predictedHTMLColumn: HTMLElement;
    public $sColumn: any;
    public $pColumn;
    
    public columns;
    public $columns;
    public $aPredictedBox;
    public $thSpacer: any;
    public isDragging: boolean = false;
    
    private onUpdate;
    private $aTableMoveBox;
    
    
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
    
    
    //INPUT
    onMouseDrag(e) {
        let ui = e.ui;
        //if we are not moving do nothing
        if (!this.columns || ui.left === 0)return;
        let pos = this.getPosition(ui.element);
        let cellIndex = ui.element[0].cellIndex;
        let dir = e.event.movementX > 0;
        let offset = pos.left + ui.left + (dir ? ui.element[0].clientWidth : 0);
        
        this.$selectedHTMLColumn = ui.element;
        this.$sColumn = this.columns[cellIndex];
        this.onMouseOver(offset);
        
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
    
    private isVisible(elem) {
        let rect = elem.getClientRects();
        return rect[0].left > -Math.abs(rect[0].width / 2) && rect[0].left < this.table.clientWidth;
    }
    
    
    private onMouseOver(offset: number) {
        
        let next;
        let th = this.thead.querySelectorAll('tr')[0].children;
        for (let i = 0, sibling; (sibling = th[i]) && (i < th.length); i++) {
            if (this.isVisible(sibling) && sibling.hasAttribute('a-draggable')) {
                let st = sibling.offsetLeft - this.tbody.scrollLeft;
                let en = st + sibling.clientWidth;
                if (offset > st && offset < en) next = sibling;
            }
        }
        
        
        if (next && !angular.equals(this.$predictedHTMLColumn, next)) {
            this.$predictedHTMLColumn = next;
            this.$aPredictedBox.style.display = 'block';
            this.$aPredictedBox.style.width = next.offsetWidth + 'px';
            this.$aPredictedBox.style.left = (next.offsetLeft - this.tbody.scrollLeft) + 'px';
        }
        
        
    }
    
    onMouseComplete(e) {
        if (!this.isDragging)return;
        if (this.$aTableMoveBox) this.$aTableMoveBox.remove();
        
        if (this.$selectedHTMLColumn) this.dropColumn(e).then(() => {
            this.SelectedCellClass(false);
            this.$selectedHTMLColumn = null;
        });
        
        this.$aTableMoveBox = null;
        this.$predictedHTMLColumn = null;
        this.isDragging = false;
        
        this.$aPredictedBox.style.display = 'none';
    }
    
    
    $doCheck() {
        this.postSpacer();
        // if (!angular.equals(this.$columns, this.columns)) {
        //     console.log('$doCheck')
        //     this.$columns = angular.copy(this.columns);
        //     this.postSpacer();
        // }
    }
    
    $postLink = () => this.postSpacer;
    
    
    /**
     * This is a spacer to place for the vertical bar width onto the hearder
     */
    private postSpacer() {
        let thRow = this.thead.getElementsByTagName("tr")[0];
        let offset = this.thead.clientWidth - this.tbody.clientWidth;
        if (this.$thSpacer) this.$thSpacer.remove();
        if (offset) {
            this.$thSpacer = (thRow as any).insertCell(thRow.children.length);
            this.$thSpacer.setAttribute("class", "eq-thead-spacer");
            this.$thSpacer.style.width = (offset + 1) + 'px';
        }
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
    
    
    private dropColumn(e) {
        let $target: any = this.$predictedHTMLColumn;
        let $column = this.$selectedHTMLColumn[0];
        
        return new Promise((resolve) => {
            let $e: any = {};
            if ($target) {
                
                Object.assign($e, {
                    fromColumn: $column,
                    toColumn  : $target,
                    fromIndex : $column.cellIndex,
                    toIndex   : $target.cellIndex,
                });
                
                if (this.columns) {
                    let from = angular.copy(this.columns[$e.fromIndex]);
                    //remove it from order
                    this.columns.splice($e.fromIndex, 1);
                    //push to new order
                    this.columns.splice($e.toIndex, 0, from);
                    Object.assign($e, {
                        columns: this.columns
                    });
                }
            }
            
            
            if (!angular.equals(this.$columns, this.columns))
                this.onUpdate({
                    $event: $e
                });
            
            
            try {
                (this.$scope as any).$apply();
            } catch (e) {
            }
            
            
            resolve($e);
        })
    }
    
    
    private SelectedCellClass(bool: boolean, name?: string) {
        
        let cellIndex = (this.$selectedHTMLColumn[0] as any).cellIndex;
        
        let _class = name ? [] : ['selected-cell', 'last-cell'];
        if (name) _class.push(name + "-cell");
        
        this.$selectedHTMLColumn[bool ? 'addClass' : 'removeClass'](_class.join(" "));
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
        
        this.$selectedHTMLColumn.addClass('selected-cell');
        
        table.css({
            width : '100%',
            height: this.table.clientHeight + 'px'
        });
        
        
        th.html(this.$selectedHTMLColumn.html());
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


import "./styles.css";

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
