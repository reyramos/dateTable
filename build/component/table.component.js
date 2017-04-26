"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/Rx");
var TableCtrl = (function () {
    function TableCtrl($element, $scope) {
        this.$element = $element;
        this.$scope = $scope;
        this.$selectedColumnRows = [];
        this.headers = [];
        this.isDragging = false;
        this.table = $element[0].querySelector("table");
        this.thead = $element[0].querySelector("table > thead");
        this.tbody = $element[0].querySelector("table > tbody");
        this.$aPredictedBox = document.createElement("div");
        this.$aPredictedBox.className = "a-table-predicted-box";
        this.$aPredictedBox.setAttribute("draggable", "");
    }
    TableCtrl.prototype.$onInit = function () {
        var _this = this;
        this.tbody.addEventListener('scroll', function (e) { return _this.thead.scrollLeft = e.target.scrollLeft; });
        if (this.columns) {
            this.$element.append(this.$aPredictedBox);
            this.$aPredictedBox.style.display = "none";
        }
    };
    TableCtrl.prototype.onMouseDrag = function (e) {
        var pos = e.ui;
        var jE = pos.element;
        console.log('pos', pos);
    };
    TableCtrl.prototype.onMouseComplete = function (e) {
        console.log('mouseup', e);
    };
    TableCtrl.prototype.$doCheck = function () {
        clearTimeout(this.$postLinkTimeout);
        this.postSpacer();
    };
    TableCtrl.prototype.$postLink = function () {
        this.postSpacer();
    };
    TableCtrl.prototype.postSpacer = function () {
        var _this = this;
        this.$postLinkTimeout = setTimeout(function () {
            var offset = _this.thead.clientWidth - _this.tbody.clientWidth;
            if (_this.$thSpacer)
                _this.$thSpacer.remove();
            if (offset) {
                var thRow = _this.thead.getElementsByTagName("tr")[0];
                _this.$thSpacer = thRow.insertCell(thRow.children.length);
                _this.$thSpacer.setAttribute("class", "eq-thead-spacer");
                _this.$thSpacer.style.width = offset + 'px';
            }
        }, 0);
    };
    TableCtrl.prototype.getPosition = function (ele) {
        var rect = null;
        var pT = null;
        try {
            rect = (ele[0] || ele).getBoundingClientRect();
            pT = (this.$element[0] || this.$element).getBoundingClientRect();
        }
        catch (e) {
        }
        var rT = rect.top + window.pageYOffset - pT.top, rL = rect.left + window.pageXOffset - pT.left;
        return { top: rT, left: rL };
    };
    TableCtrl.prototype.AttachEvents = function () {
        console.log('AttachEvents');
    };
    TableCtrl.prototype.$onDestroy = function () {
    };
    return TableCtrl;
}());
TableCtrl.$inject = ['$element', '$scope'];
require('./table.less');
var Table = (function () {
    function Table() {
        this.bindings = {
            onUpdate: '&',
            columns: '=?'
        };
        this.controller = TableCtrl;
    }
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.component.js.map