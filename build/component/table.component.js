"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var TableCtrl = (function () {
    function TableCtrl($element, $scope) {
        this.$element = $element;
        this.$scope = $scope;
        this.$selectedColumnRows = [];
        this.headers = [];
        this.$mousedown = false;
        this.$mousemove = false;
        this.createDraggableTable = function () {
            var self = this;
            var table = angular.element("<table/>");
            var thead = angular.element("<thead/>");
            var tbody = angular.element("<tbody/>");
            var tr = angular.element("<tr/>");
            var th = angular.element("<th/>");
            table.addClass(this.table.attr("class"));
            this.$selectedColumn.addClass('selected-cell');
            table.css({
                width: '100%',
                height: this.table[0].clientHeight + 'px'
            });
            th.html(this.$selectedColumn.html());
            tr.append(th);
            thead.append(tr);
            table.append(thead);
            table.append(tbody);
            return table;
        };
        this.table = angular.element($element[0].querySelector("table"));
        this.thead = angular.element($element[0].querySelector("table > thead"));
        this.tbody = angular.element($element[0].querySelector("table > tbody"));
        this.$aPredictedBox = angular.element('<div class="a-table-predicted-box" draggable=""></div>');
    }
    TableCtrl.prototype.$onInit = function () {
        var self = this;
        this.tbody.on('scroll', function (e) {
            self.thead[0].scrollLeft = this.scrollLeft;
        });
        if (this.reorder) {
            this.$element.append(this.$aPredictedBox);
            this.$aPredictedBox.css({
                display: 'none'
            });
        }
    };
    TableCtrl.prototype.$doCheck = function () {
        clearTimeout(this.$postLinkTimeout);
        this.postSpacer();
        if (this.reorder && !angular.equals(this.$columns, this.columns)) {
            this.$columns = angular.copy(this.columns);
            this.RemoveWindowEvent();
            this.AttachEvents();
        }
    };
    TableCtrl.prototype.$postLink = function () {
        var self = this;
        this.postSpacer();
        this.AttachEvents();
    };
    TableCtrl.prototype.AttachEvents = function () {
        var self = this;
        if (!this.reorder)
            return;
        self.headers = [];
        this.$tableTimeout = setTimeout(function () {
            self.table.find("th").each(function (hIndex, header) {
                var head = angular.element(header);
                head.css({ cursor: 'move' });
                self.headers.push(head);
                head.off("mousedown touchstart mouseup touchend dragover").on("mousedown touchstart", function (e) {
                    e.preventDefault();
                    self.$selectedColumn = angular.element(this);
                    self.selectColumn(this);
                }).on("mouseup touchend", function (e) {
                    self.MouseUp(e);
                }).on("dragover", function (e) {
                    console.log('dragover', e.target);
                });
            });
            self.AddWindowEvent();
        }, 0);
    };
    TableCtrl.prototype.postSpacer = function () {
        var self = this;
        this.$postLinkTimeout = setTimeout(function () {
            var offset = self.thead[0].clientWidth - self.tbody[0].clientWidth;
            if (self.$thSpacer)
                self.$thSpacer.remove();
            if (offset) {
                var thRow = self.thead.find("tr:first-child()");
                self.$thSpacer = thRow[0].insertCell(thRow.children().length);
                self.$thSpacer.setAttribute("class", "eq-thead-spacer");
                self.$thSpacer.style.width = offset + 'px';
            }
        }, 0);
    };
    TableCtrl.prototype.getPosition = function (ele) {
        var self = this;
        var rect = null;
        var pT = null;
        try {
            rect = (ele[0] || ele).getBoundingClientRect();
            pT = (self.$element[0] || self.$element).getBoundingClientRect();
        }
        catch (e) {
        }
        var rT = rect.top + window.pageYOffset - pT.top, rL = rect.left + window.pageXOffset - pT.left;
        return { top: rT, left: rL };
    };
    TableCtrl.prototype.MouseUp = function (e) {
        var mEvent = e.originalEvent || e;
        this.$element.off("mousemove touchmove");
        this.$mousedown = false;
    };
    TableCtrl.prototype.dropColumn = function (e) {
        var _this = this;
        var self = this;
        var $target = this.$predictedColumn;
        var $column = this.$selectedColumn[0];
        if ($target.cellIndex > $column.cellIndex)
            $target = this.headers[$target.cellIndex - 1][0];
        clearTimeout(this.$digestTimeout);
        return new Promise(function (resolve) {
            var $e = {};
            if ($target) {
                Object.assign($e, {
                    fromColumn: $column,
                    toColumn: $target,
                    fromIndex: $column.cellIndex,
                    toIndex: $target.cellIndex,
                });
                if (self.columns) {
                    var from = angular.copy(self.columns[$e.fromIndex]);
                    self.columns.splice($e.fromIndex, 1);
                    self.columns.splice($e.toIndex, 0, from);
                    Object.assign($e, {
                        columns: self.columns
                    });
                }
            }
            if (!angular.equals(_this.$columns, _this.columns))
                self.onUpdate({
                    $event: $e
                });
            try {
                self.$scope.$apply();
            }
            catch (e) {
            }
            resolve($e);
        });
    };
    TableCtrl.prototype.RemoveWindowEvent = function () {
        var self = this;
        window.removeEventListener("mouseup", function (e) {
            self.MouseUp(e);
        });
        window.removeEventListener("touchend", function (e) {
            self.MouseUp(e);
        });
    };
    TableCtrl.prototype.AddWindowEvent = function () {
        var self = this;
        window.addEventListener("mouseup", function (e) {
            self.MouseUp(e);
            self.RemoveWindowEvent();
        });
        window.addEventListener("touchend", function (e) {
            self.MouseUp(e);
            self.RemoveWindowEvent();
        });
    };
    TableCtrl.prototype.SelectedCellClass = function (bool, name) {
        var cellIndex = this.$selectedColumn[0].cellIndex;
        var _class = name ? [] : ['selected-cell'];
        if (name)
            _class.push(name + "-cell");
        this.$selectedColumn[bool ? 'addClass' : 'removeClass'](_class.join(" "));
        this.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (i, cell) {
            angular.element(cell)[bool ? 'addClass' : 'removeClass'](_class.join(" "));
        });
    };
    TableCtrl.prototype.findCell = function (ele) {
        if (!ele)
            return false;
        if (['TH', 'TD'].indexOf(ele.nodeName) > -1) {
            return ele;
        }
        else {
            return this.findCell(ele.parentNode);
        }
    };
    TableCtrl.prototype.selectColumn = function (cEvent) {
        var _this = this;
        var self = this;
        if (!self.$selectedColumn)
            return;
        var $predictedColumn;
        var totalDistance = 0;
        var lastSeenAt = 0;
        var pos = self.getPosition(cEvent);
        var selectedColumnMaxOutside = this.$selectedColumn[0].offsetLeft + this.$selectedColumn[0].offsetWidth;
        this.$element.off("mousemove touchmove mouseup touchend", function () {
            $predictedColumn = null;
        }).on("mousemove touchmove", function (event) {
            _this.$mousedown = true;
            if (!_this.$selectedColumn)
                return;
            var e = event.originalEvent || event;
            e.preventDefault();
            var cellIndex = _this.$selectedColumn[0].cellIndex;
            var left;
            if (pos && !_this.$aTableMoveBox) {
                _this.$aTableMoveBox = angular.element('<div class="a-table-move-box" draggable="true"></div>');
                _this.$aTableMoveBox.css({
                    width: _this.$selectedColumn[0].clientWidth + 'px',
                    height: _this.table[0].offsetWidth + 'px',
                    left: (pos.left + (cellIndex ? 1 : 0)) + 'px'
                });
                var dragTable_1 = _this.createDraggableTable();
                dragTable_1.addClass('draggable');
                self.table.find("tr td:nth-child(" + (cellIndex + 1) + ")").each(function (cellIndex, cell) {
                    self.$selectedColumnRows.push(cell);
                    var tr = angular.element("<tr/>");
                    var td = angular.element("<td/>");
                    cell.classList += " selected-cell";
                    td.html(cell.innerHTML);
                    tr.append(td);
                    dragTable_1.find("tbody").append(tr);
                });
                self.$aTableMoveBox.append(dragTable_1);
                self.$element.append(self.$aTableMoveBox);
            }
            else if (self.$aTableMoveBox !== null) {
                if (lastSeenAt)
                    totalDistance += e.pageX - lastSeenAt;
                lastSeenAt = e.pageX;
                left = totalDistance + pos.left;
                self.$aTableMoveBox.css({
                    left: left,
                });
            }
            cellIndex = _this.findCell(e.target).cellIndex;
            var predictedColumn;
            console.log('other', e.pageX);
            if (!cellIndex) {
                var x = (left || 0) + _this.$selectedColumn[0].offsetLeft;
                if (x > _this.$selectedColumn[0].offsetLeft && x < selectedColumnMaxOutside) {
                    predictedColumn = _this.$selectedColumn[0];
                }
            }
            else {
                predictedColumn = _this.headers[cellIndex][0];
            }
            if (!predictedColumn)
                return;
            if (angular.equals(predictedColumn, $predictedColumn))
                return;
            $predictedColumn = predictedColumn;
            _this.insertTableColumn(predictedColumn);
        });
    };
    TableCtrl.prototype.insertTableColumn = function (column) {
        var self = this;
        if (!angular.equals(this.pColumn, column)) {
            if (this.$thCell)
                this.$thCell.remove();
            if (this.$tbCell)
                this.$tbCell.remove();
            this.pColumn = column;
            var cellPosition = column.cellIndex;
            var cellWidth = column.offsetWidth;
            var rowCount = "" + self.table.find("tr").length;
            var thRow = this.thead.find("tr:first-child()");
            var tbRow = this.tbody.find("tr:first-child()");
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
            var thSpan = document.createElement("span");
            thSpan.setAttribute("class", "a-table-predicted-column");
            thSpan.style.padding = "0px";
            thSpan.style.margin = "0px";
            thSpan.style.width = cellWidth + 'px';
            var tbSpan = thSpan.cloneNode(true);
            this.$thCell.appendChild(thSpan);
            this.$tbCell.appendChild(tbSpan);
            this.$aPredictedBox.css({
                display: 'block',
                width: this.$thCell.offsetWidth + 'px',
                left: (this.$thCell.offsetLeft - this.tbody[0].scrollLeft) + 'px',
            });
        }
    };
    TableCtrl.prototype.$onDestroy = function () {
        clearTimeout(this.$postLinkTimeout);
        clearTimeout(this.$digestTimeout);
        clearTimeout(this.$tableTimeout);
        this.RemoveWindowEvent();
    };
    return TableCtrl;
}());
TableCtrl.$inject = ['$element', '$scope'];
require('./table.less');
var Table = (function () {
    function Table() {
        this.bindings = {
            onUpdate: '&',
            columns: '=?',
            reorder: '<?'
        };
        this.controller = TableCtrl;
    }
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.component.js.map