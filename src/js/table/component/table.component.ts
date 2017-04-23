import * as angular from "angular";

import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from "rxjs";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;
declare let Rx: any;

class TableCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element', '$scope'];

    private table;
    private thead;
    private tbody;
    private $selectedColumn;
    private $selectedColumnRows = [];
    private $predictedColumn;
    private headers: Array<any> = [];

    private columns;
    private $columns;


    private $postLinkTimeout;
    private $digestTimeout;
    private $tableTimeout;
    private $aPredictedBox;
    private $thSpacer: any;


    private onUpdate;
    private $mousedown: boolean = false;
    private $mousemove: boolean = false;
    private $aTableMoveBox;
    private pColumn;
    private $thCell: any;
    private $tbCell: any;


    private MouseDrag: Subscription;
    private isDragging: boolean = false;
    private handlerMouseDown;
    private docMouseMove;
    private docMouseUp;

    OnHandlerMouseDown?(event: Event): void;


    constructor(private $element, private $scope: ng.IScope) {
        //the table
        this.table = $element[0].querySelector("table");
        //the head
        this.thead = $element[0].querySelector("table > thead");
        //the body
        this.tbody = $element[0].querySelector("table > tbody");

        this.$aPredictedBox = document.createElement("div");
        this.$aPredictedBox.className = "a-table-predicted-box";
        this.$aPredictedBox.setAttribute("draggable", "");


        this.handlerMouseDown = new Subject();
        this.docMouseMove = new Subject();
        this.docMouseUp = new Subject();

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

            document.addEventListener("mousemove", this.onMousemove);
            document.addEventListener("mouseup", this.onMouseup);

        }
    }

    onMousemove(event: MouseEvent) {
        console.log('onMousemove')
        this.docMouseMove.next(event);
    }

    onMouseup(event: MouseEvent) {
        if (this.isDragging) {
            this.isDragging = false;
        }

        console.log('onMouseup')
        this.docMouseUp.next(event);
    }

    $doCheck() {
        clearTimeout(this.$postLinkTimeout);
        this.postSpacer();
        //
        // if (this.reorder && !angular.equals(this.$columns, this.columns)) {
        //     this.$columns = angular.copy(this.columns);
        //     this.RemoveWindowEvent();
        //     this.AttachEvents();
        //
        // }
    }

    $postLink() {
        this.postSpacer();
        if (this.columns) this.$tableTimeout = setTimeout(() => {
            this.AttachEvents()
            this.CreateDrag();
        }, 0);
    }


    /**
     * This is a spacer to place for the vertical bar width onto the hearder
     */
    private postSpacer() {
        this.$postLinkTimeout = setTimeout(() => {
            let offset = this.thead.clientWidth - this.tbody.clientWidth;
            if (this.$thSpacer) this.$thSpacer.remove();
            if (offset) {
                let thRow = this.thead.getElementsByTagName("tr")[0];
                this.$thSpacer = (thRow as any).insertCell(thRow.children.length);
                this.$thSpacer.setAttribute("class", "eq-thead-spacer");
                this.$thSpacer.style.width = offset + 'px';
            }
        }, 0);
    }


    private getPosition(ele) {
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


    private get LayoutElement(): HTMLElement {
        return this.$element;
    }

    private totalDistanceX = 0;
    private lastSeenAtX = 0;
    private curX = 0;

    private AttachEvents() {
        let self = this;

        let th = this.thead.querySelectorAll('tr')[0].children;
        self.OnHandlerMouseDown = (ele) => {

            let pos = this.getPosition(ele);
            this.isDragging = false;
            this.totalDistanceX = 0;
            this.lastSeenAtX = 0;
            this.curX = pos.left;

            // this.handlerMouseDown.emit(event);
            this.handlerMouseDown.next(ele);
        };

        for (let i = 0; i < th.length; i++) {
            th[i].addEventListener("mousedown", function (e) {
                self.OnHandlerMouseDown(this)
            });
        }


        // this.$tableTimeout = setTimeout(()=> {
        //     self.headers = [];
        //
        //     self.table.find("th").each(function (hIndex, header) {
        //         let head = angular.element(header);
        //         head.css({cursor: 'move'});
        //         self.headers.push(head);
        //         head.off("mousedown touchstart mouseup touchend dragover").on("mousedown touchstart", function (e) {
        //             e.preventDefault();
        //             self.$selectedColumn = angular.element(this);
        //             self.selectColumn(this);
        //         }).on("mouseup touchend", function (e) {
        //             self.MouseUp(e)
        //         }).on("dragover", function (e) {
        //             console.log('dragover', e.target)
        //         })
        //     });
        //     self.AddWindowEvent();
        // }, 0);
    }

    private getRect() {
        let rect = (this.$element[0] || this.$element).getBoundingClientRect();
        let rT = rect.top + window.pageYOffset - document.documentElement.clientTop;
        let rL = rect.left + window.pageXOffset - document.documentElement.clientLeft;
        return {top: rT, left: rL};

    }

    private CreateDrag() {


        let mouseDragEvent = this.handlerMouseDown.map(event => {
            let rect = this.getRect();
            return {top: rect.top, left: rect.left};
        })
            .flatMap(
                imageOffset => this.docMouseMove.map(event => {
                    this.isDragging = true;

                    if (this.lastSeenAtX) this.totalDistanceX += event.pageX - this.lastSeenAtX;
                    this.lastSeenAtX = event.pageX;


                    return {
                        ui   : {
                            top   : 0,
                            left  : this.totalDistanceX,
                            handle: event
                        },
                        event: event
                    }
                })
                    .takeUntil(this.docMouseUp)
            );


        this.MouseDrag = mouseDragEvent.subscribe({
            next: pos => {
                console.log(pos)
                // this.LayoutElement.style.top = this.curY + pos.ui.top + 'px';
                // this.LayoutElement.style.left = this.curX + pos.ui.left + 'px';
            }
        });
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
    //
    // private RemoveWindowEvent() {
    //     let self: any = this;
    //     window.removeEventListener("mouseup", function (e) {
    //         self.MouseUp(e);
    //     });
    //     window.removeEventListener("touchend", function (e) {
    //         self.MouseUp(e);
    //     });
    // }
    //
    // private AddWindowEvent() {
    //     let self: any = this;
    //     window.addEventListener("mouseup", function (e) {
    //         self.MouseUp(e);
    //         self.RemoveWindowEvent();
    //     });
    //     window.addEventListener("touchend", function (e) {
    //         self.MouseUp(e);
    //         self.RemoveWindowEvent();
    //     });
    // }
    //
    // private SelectedCellClass(bool: boolean, name?: string) {
    //
    //     let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
    //
    //     let _class = name ? [] : ['selected-cell', 'last-cell'];
    //     if (name) _class.push(name + "-cell");
    //
    //     this.$selectedColumn[bool ? 'addClass' : 'removeClass'](_class.join(" "));
    //     this.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (i, cell) {
    //         angular.element(cell)[bool ? 'addClass' : 'removeClass'](_class.join(" "));
    //     });
    // }
    //
    // private createDraggableTable = function () {
    //     let self: any = this;
    //
    //     let table = angular.element("<table/>");
    //     let thead = angular.element("<thead/>");
    //     let tbody = angular.element("<tbody/>");
    //     let tr = angular.element("<tr/>");
    //     let th = angular.element("<th/>");
    //     table.addClass(this.table.attr("class"));
    //
    //     this.$selectedColumn.addClass('selected-cell');
    //
    //     table.css({
    //         width : '100%',
    //         height: this.table[0].clientHeight + 'px'
    //     });
    //
    //
    //     th.html(this.$selectedColumn.html());
    //     tr.append(th);
    //     thead.append(tr);
    //     table.append(thead);
    //     table.append(tbody);
    //     return table;
    // };
    //
    // private findCell(ele) {
    //     if (!ele)return false;
    //
    //     if (['TH', 'TD'].indexOf(ele.nodeName) > -1) {
    //         return ele;
    //     } else {
    //         return this.findCell(ele.parentNode);
    //     }
    //
    // }
    //
    // private selectColumn(cEvent) {
    //     let self: any = this;
    //     if (!self.$selectedColumn)return;
    //     let $predictedColumn: any;
    //     let $predictedColumnObject: any;
    //     let totalDistance = 0;
    //     let lastSeenAt = 0;
    //     let pos = self.getPosition(cEvent);
    //     let selectedColumnMaxOutside = this.$selectedColumn[0].offsetLeft + this.$selectedColumn[0].offsetWidth;
    //
    //
    //     this.$element.off("mousemove touchmove mouseup touchend", function () {
    //         $predictedColumn = null;
    //     }).on("mousemove touchmove", (event) => {
    //
    //         this.$mousedown = true;
    //
    //         if (!this.$selectedColumn)return;
    //         let e = event.originalEvent || event;
    //         e.preventDefault();
    //
    //         let cellIndex = (this.$selectedColumn[0] as any).cellIndex;
    //         let left;
    //
    //         if (pos && !this.$aTableMoveBox) {
    //             this.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable="true"></div>');
    //             this.$aTableMoveBox.css({
    //                 width : this.$selectedColumn[0].clientWidth + 'px',
    //                 height: this.table[0].offsetWidth + 'px',
    //                 left  : (pos.left + (cellIndex ? 1 : 0)) + 'px'
    //             });
    //
    //             let dragTable = this.createDraggableTable();
    //             dragTable.addClass('draggable');
    //             let cellPos = cellIndex + 1;
    //
    //             if (cellPos === self.headers.length) this.$selectedColumn.addClass("last-cell")
    //             self.table.find("tr td:nth-child(" + cellPos + ")").each(function (cellIndex, cell) {
    //                 self.$selectedColumnRows.push(cell);
    //                 let tr = angular.element("<tr/>");
    //                 let td = angular.element("<td/>");
    //                 cell.classList += " selected-cell" + (cellPos === self.headers.length ? " last-cell" : "");
    //
    //
    //                 td.html(cell.innerHTML);
    //                 tr.append(td);
    //                 dragTable.find("tbody").append(tr);
    //             });
    //
    //             self.$aTableMoveBox.append(dragTable);
    //             self.$element.append(self.$aTableMoveBox);
    //
    //         } else if (self.$aTableMoveBox !== null) {
    //             if (lastSeenAt) totalDistance += e.pageX - lastSeenAt;
    //             lastSeenAt = e.pageX;
    //             left = totalDistance + pos.left;
    //             self.$aTableMoveBox.css({
    //                 left: left,
    //             });
    //         }
    //
    //
    //         cellIndex = e.target.cellIndex;
    //         let predictedColumn: any;
    //         try {
    //             if (cellIndex > -1) {
    //                 predictedColumn = self.headers[cellIndex][0];
    //                 if (!angular.equals($predictedColumn, predictedColumn)) $predictedColumn = predictedColumn;
    //             } else if (!angular.equals(self.$selectedColumn[0], $predictedColumn)) {
    //                 $predictedColumn = $predictedColumn || self.$selectedColumn[0];
    //                 self.insertTableColumn($predictedColumn)
    //             }
    //         } catch (e) {
    //         }
    //
    //
    //         // cellIndex = this.findCell(e.target).cellIndex;
    //         // let predictedColumn: any;
    //
    //         //
    //         // if (!cellIndex) {
    //         //     let x = (left || 0) + this.$selectedColumn[0].offsetLeft;
    //         //     if (x > this.$selectedColumn[0].offsetLeft && x < selectedColumnMaxOutside) {
    //         //         predictedColumn = this.$selectedColumn[0];
    //         //     }
    //         // } else {
    //         //     predictedColumn = this.headers[cellIndex][0];
    //         //
    //         // }
    //         //
    //         // // this.$predictedColumn = predictedColumn
    //         //
    //         // if (predictedColumn && !angular.equals(predictedColumn, $predictedColumn)) {
    //         //     $predictedColumn = predictedColumn;
    //         //     // this.insertTableColumn($predictedColumn);
    //         // }
    //         // if (predictedColumn) {
    //         //
    //         //     var xPos = left + this.$aTableMoveBox[0].offsetWidth / 2;
    //         //     var x1 = predictedColumn.offsetLeft;
    //         //     var x2 = x1 + predictedColumn.offsetWidth;
    //         //     var x3 = x2 / 2;
    //         //
    //         //     $predictedColumn = {
    //         //         cellIndex  : predictedColumn.cellIndex,
    //         //         // cellIndex  : xPos > x3 ? $predictedColumn.cellIndex + 1 : $predictedColumn.cellIndex - 1,
    //         //         // offsetWidth: this.$aTableMoveBox[0].offsetWidth
    //         //         offsetWidth: predictedColumn.offsetWidth
    //         //     };
    //         //     //
    //         //     // if($predictedColumn.cellIndex > 0 && !angular.equals($predictedColumnObject, $predictedColumn)){
    //         //     //     $predictedColumnObject = $predictedColumn;
    //         //     // console.log('$predictedColumn:2:', predictedColumn.cellIndex)
    //         //     // this.insertTableColumn($predictedColumn);
    //         //     //
    //         //     // }
    //         //
    //         // }
    //         //
    //         //
    //         //
    //         //
    //         // // try {
    //         // //     if (cellIndex > -1) {
    //         // //         predictedColumn = self.headers[cellIndex][0];
    //         // //         if (!angular.equals($predictedColumn, predictedColumn))$predictedColumn = predictedColumn;
    //         // //     } else if (!angular.equals(self.$selectedColumn[0], $predictedColumn)) {
    //         // //         $predictedColumn = $predictedColumn || self.$selectedColumn[0];
    //         // //         self.insertTableColumn($predictedColumn)
    //         // //     }
    //         // // } catch (e) {
    //         // // }
    //         // // if ($predictedColumn)
    //         // //     this.$aPredictedBox.css({
    //         // //         display: 'block',
    //         // //         width  : $predictedColumn.offsetWidth + 'px',
    //         // //         left   : ($predictedColumn.offsetLeft - this.tbody[0].scrollLeft) + 'px',
    //         // //     });
    //         // // this.insertTableColumn(predictedColumn);
    //
    //
    //     })
    //
    // }
    //
    //
    // private insertTableColumn(column) {
    //     let self: any = this;
    //
    //     if (!angular.equals(this.pColumn, column)) {
    //         if (this.$thCell) this.$thCell.remove();
    //         if (this.$tbCell) this.$tbCell.remove();
    //
    //         this.pColumn = column;
    //         let cellPosition = column.cellIndex;
    //         let cellWidth = column.offsetWidth;
    //         let rowCount: string = <string> "" + self.table.find("tr").length;
    //
    //         let thRow = this.thead.find("tr:first-child()");
    //         let tbRow = this.tbody.find("tr:first-child()");
    //
    //         this.$thCell = thRow[0].insertCell(cellPosition);
    //         this.$thCell.setAttribute("class", "a-table-predicted-column");
    //         this.$thCell.style.width = cellWidth + 'px';
    //         this.$thCell.style.padding = '0px';
    //         this.$thCell.style.margin = '0px';
    //
    //
    //         this.$tbCell = tbRow[0].insertCell(cellPosition);
    //         this.$tbCell.setAttribute("class", "a-table-predicted-column");
    //         this.$tbCell.rowSpan = rowCount;
    //         this.$tbCell.style.width = cellWidth + 'px';
    //         this.$tbCell.style.padding = '0px';
    //         this.$tbCell.style.margin = '0px';
    //
    //         //create a span with no styles, since it will be the filler to set the width of the cell
    //         let thSpan = document.createElement("span");
    //         thSpan.setAttribute("class", "a-table-predicted-column");
    //         thSpan.style.padding = "0px";
    //         thSpan.style.margin = "0px";
    //         thSpan.style.width = cellWidth + 'px';
    //
    //         //copy for the tbody
    //         let tbSpan = thSpan.cloneNode(true);
    //
    //         this.$thCell.appendChild(thSpan);
    //         this.$tbCell.appendChild(tbSpan);
    //
    //         this.$aPredictedBox.css({
    //             display: 'block',
    //             width  : this.$thCell.offsetWidth + 'px',
    //             left   : (this.$thCell.offsetLeft - this.tbody[0].scrollLeft) + 'px',
    //         });
    //
    //     }
    //
    // }

    $onDestroy() {
        clearTimeout(this.$postLinkTimeout);
        clearTimeout(this.$digestTimeout);
        clearTimeout(this.$tableTimeout);
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
