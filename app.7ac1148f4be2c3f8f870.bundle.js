webpackJsonp([1,3],{10:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(137),o=t(11).app;t(20)(o),t(21)(o),o.filter("range",n.Range),e.exports=o},11:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0);exports.app=n.module("app.core",[])},12:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n;!function(e){e.routes=[{name:"rootBundle",abstract:!0,url:"/"},{name:"rootBundle.root",template:t(18),abstract:!0,resolve:{register:["jsBundleResolver",function(e){return e(function(e,n){t.e(1).then(function(){e.register(t(25)),n()}.bind(null,t)).catch(t.oe)})}]}},{name:"about",url:"about/",parent:"rootBundle.root",component:"eqAbout"},{name:"contact",url:"contact/",parent:"rootBundle.root",component:"eqContact"}]}(n=exports.Public||(exports.Public={}))},136:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e){this.$scope=e}return e}();n.$inject=["$scope"];var o=function(){function e(){this.template="Contact Page",this.controller=n}return e}();exports.ContactComponent=o},137:function(e,exports,t){"use strict";function n(){return function(e,t){t=Math.floor(t);for(var n=0;n<t;n++)e.push(n+1);return e}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.Range=n},138:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0),o=function(){function e(e,t){this.$element=e,this.$scope=t,this.headers=[],this.createDraggableTable=function(){var e=n.element("<table/>"),t=n.element("<thead/>"),o=n.element("<tbody/>"),i=n.element("<tr/>"),r=n.element("<th/>");return e.addClass(this.table.attr("class")),this.$selectedColumn.addClass("selected-cell"),e.css({width:"100%",height:this.table[0].clientHeight+"px"}),r.html(this.$selectedColumn.html()),i.append(r),t.append(i),e.append(t),e.append(o),e},this.table=n.element(e[0].querySelector("table")),this.thead=n.element(e[0].querySelector("table > thead")),this.tbody=n.element(e[0].querySelector("table > tbody")),this.$aPredictedBox=n.element('<div class="a-table-predicted-box" draggable=""></div>')}return e.prototype.$onInit=function(){var e=this;this.tbody.on("scroll",function(t){e.thead[0].scrollLeft=this.scrollLeft}),this.reorder&&(this.$element.append(this.$aPredictedBox),this.$aPredictedBox.css({display:"none"}))},e.prototype.$doCheck=function(){clearTimeout(this.$postLinkTimeout),this.postSpacer(),this.reorder&&!n.equals(this.$columns,this.columns)&&(this.$columns=n.copy(this.columns),this.RemoveWindowEvent(),this.AttachEvents())},e.prototype.$postLink=function(){this.postSpacer(),this.AttachEvents()},e.prototype.AttachEvents=function(){var e=this;this.reorder&&(e.headers=[],this.$tableTimeout=setTimeout(function(){e.table.find("th").each(function(t,o){var i=n.element(o);i.css({cursor:"move"}),e.headers.push(i),i.off("mousedown touchstart").on("mousedown touchstart",function(t){t.preventDefault(),e.$selectedColumn=n.element(this),e.selectColumn(this)}).off("mouseup touchend").on("mouseup touchend",function(t){e.MouseUp(t)})}),e.AddWindowEvent()},0))},e.prototype.postSpacer=function(){var e=this,t=this;this.$postLinkTimeout=setTimeout(function(){var n=t.thead[0].clientWidth-t.tbody[0].clientWidth,o=t.thead.find(".eq-thead-spacer");n&&!o.length&&(o=document.createElement("td"),o.classList+="eq-thead-spacer",e.thead[0].children[0].appendChild(o),o.style.width=n+"px")},0)},e.prototype.getPosition=function(e){var t=this,n=null,o=null;try{n=(e[0]||e).getBoundingClientRect(),o=(t.$element[0]||t.$element).getBoundingClientRect()}catch(e){}var i=n.top+window.pageYOffset-o.top,r=n.left+window.pageXOffset-o.left;return{top:i,left:r}},e.prototype.MouseUp=function(e){var t=this,n=e.originalEvent||e;this.$element.off("mousemove touchmove"),this.$thCell&&this.$thCell.remove(),this.$tbCell&&this.$tbCell.remove(),this.$aTableMoveBox&&this.$aTableMoveBox.remove(),this.$selectedColumn&&this.dropColumn(n).then(function(){t.SelectedCellClass(!1),t.$selectedColumn=null}),this.$predictedColumn=null,this.$aTableMoveBox=null,this.pColumn=null,this.$thCell=null,this.$tbCell=null,this.$aPredictedBox.css({display:"none"})},e.prototype.dropColumn=function(e){var t=this,o=this,i=this.$predictedColumn,r=this.$selectedColumn[0];return clearTimeout(this.$digestTimeout),new Promise(function(e){var a={};if(i&&(Object.assign(a,{fromColumn:r,toColumn:i,fromIndex:r.cellIndex,toIndex:i.cellIndex}),o.columns)){var l=n.copy(o.columns[a.fromIndex]);o.columns.splice(a.fromIndex,1),o.columns.splice(a.toIndex,0,l),Object.assign(a,{columns:o.columns})}n.equals(t.$columns,t.columns)||o.onUpdate({$event:a});try{o.$scope.$apply()}catch(e){}e(a)})},e.prototype.RemoveWindowEvent=function(){var e=this;window.removeEventListener("mouseup",function(t){e.MouseUp(t)}),window.removeEventListener("touchend",function(t){e.MouseUp(t)})},e.prototype.AddWindowEvent=function(){var e=this;window.addEventListener("mouseup",function(t){e.MouseUp(t),e.RemoveWindowEvent()}),window.addEventListener("touchend",function(t){e.MouseUp(t),e.RemoveWindowEvent()})},e.prototype.SelectedCellClass=function(e,t){var o=this.$selectedColumn[0].cellIndex,i=["selected-cell"];t&&i.push(t+"-cell"),this.$selectedColumn[e?"addClass":"removeClass"](i.join(" ")),this.table.find("tr td:nth-child("+(o+1)+")").each(function(t,o){n.element(o)[e?"addClass":"removeClass"](i.join(" "))})},e.prototype.selectColumn=function(e){var t,o=this;if(o.$selectedColumn){var i,r=0,a=0,l=o.getPosition(e);this.$element.off("mousemove touchmove mouseup touchend").on("mousemove touchmove",function(e){if(clearTimeout(t),o.$selectedColumn){var s=e.originalEvent||e;s.preventDefault();var c=o.$selectedColumn[0].cellIndex;if(l&&!o.$aTableMoveBox){o.$aTableMoveBox=n.element('<div class="a-table-move-box" draggable=""></div>'),o.$aTableMoveBox.css({width:o.$selectedColumn[0].clientWidth+"px",height:o.table[0].offsetWidth+"px",left:l.left+(c?1:0)+"px"});var u=o.createDraggableTable();u.addClass("draggable"),o.table.find("tr td:nth-child("+(c+1)+")").each(function(e,t){var o=n.element("<tr/>"),i=n.element("<td/>");t.classList+=" selected-cell",i.html(t.innerHTML),o.append(i),u.find("tbody").append(o)}),o.$aTableMoveBox.append(u),o.$element.append(o.$aTableMoveBox)}else if(null!==o.$aTableMoveBox){a&&(r+=s.pageX-a),a=s.pageX;var d=r+l.left;o.$aTableMoveBox.css({left:d})}c=s.target.cellIndex;var p;try{c>-1?(p=o.headers[c][0],n.equals(i,p)||(i=p)):n.equals(o.$selectedColumn[0],i)||(i=i||o.$selectedColumn[0],o.insertTableColumn(r>0,i))}catch(e){}}})}},e.prototype.insertTableColumn=function(e,t){var o=this;if(!n.equals(this.pColumn,t)){this.$thCell&&this.$thCell.remove(),this.$tbCell&&this.$tbCell.remove(),this.pColumn=t;var i=t.cellIndex>-1?t.cellIndex:0,r=t.offsetWidth,a=""+o.table.find("tr").length,l=this.thead.find("tr:first-child()"),s=this.tbody.find("tr:first-child()");this.$thCell=l[0].insertCell(i),this.$thCell.setAttribute("class","a-table-predicted-column"),this.$thCell.style.width=r+"px",this.$thCell.style.padding="0px",this.$thCell.style.margin="0px",this.$tbCell=s[0].insertCell(i),this.$tbCell.setAttribute("class","a-table-predicted-column"),this.$tbCell.rowSpan=a,this.$tbCell.style.width=r+"px",this.$tbCell.style.padding="0px",this.$tbCell.style.margin="0px";var c=document.createElement("span");c.setAttribute("class","a-table-predicted-column"),c.style.padding="0px",c.style.margin="0px",c.style.width=r+"px";var u=c.cloneNode(!0);this.$thCell.appendChild(c),this.$tbCell.appendChild(u),this.$aPredictedBox.css({display:"block",width:this.$thCell.offsetWidth+"px",left:this.$thCell.offsetLeft-this.tbody[0].scrollLeft+"px"});var d=e?i-1:i,p=o.headers[d>-1?d:0][0];o.$predictedColumn=p}},e.prototype.$onDestroy=function(){clearTimeout(this.$postLinkTimeout),clearTimeout(this.$digestTimeout),clearTimeout(this.$tableTimeout),this.RemoveWindowEvent()},e}();o.$inject=["$element","$scope"],t(146);var i=function(){function e(){this.bindings={onUpdate:"&",columns:"=?",reorder:"<?"},this.controller=o}return e}();exports.Table=i},139:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e,t){this.$scope=e,this.$element=t,this.columns=[],this.rows=[],this.test=t.find("#test");for(var n=this,o=0;o<10;o++){var i="column_"+o;n.columns.push({name:i})}for(var r=function(e){var t={};n.columns.forEach(function(n){t[n.name]="row_"+e+" ("+n.name+")"}),n.rows.push(t)},o=0;o<100;o++)r(o)}return e.prototype.$onInit=function(){},e.prototype.TheHead=function(e,t){e.preventDefault(),e.stopPropagation()},e.prototype.onColumnChange=function(e){},e}();n.$inject=["$scope","$element"],t(147);var o=function(){function e(){this.template=t(145),this.controller=n}return e}();exports.DemoComponent=o},14:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(12),o=t(142),i=function(){function e(e){this.states=e,e.inject(n.Public.routes),e.inject(o.DataTable.routes)}return e}();i.$inject=["routeStateProvider"],exports.RouteProvider=i},140:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0),o=t(139),i=n.module("demo.queryBuilder",[]);i.component("demoComponent",new o.DemoComponent),e.exports=i},141:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0),o=t(138),i=n.module("app.dataTable",[]);i.component("aTable",new o.Table),e.exports=i},142:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n;!function(e){e.routes=[{name:"DataTable",parent:"rootBundle.root",abstract:!0,resolve:{ModuleResolver:["jsBundleResolver",function(e){return e(function(e,n){t.e(1).then(function(){e.register(t(140)),e.register(t(141)),n()}.bind(null,t)).catch(t.oe)})}]}},{name:"root",parent:"DataTable",component:"demoComponent"}]}(n=exports.DataTable||(exports.DataTable={}))},143:function(e,exports){e.exports="a-table {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  align-content: stretch;\n  overflow: hidden;\n}\na-table .a-table-move-box {\n  position: absolute;\n  background-color: #ffffff;\n  pointer-events: none;\n  z-index: 2;\n  overflow: hidden;\n  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);\n}\na-table .a-table-move-box > table {\n  width: 100%;\n  user-select: none;\n}\na-table .a-table-move-box > table thead,\na-table .a-table-move-box > table tbody {\n  overflow: hidden;\n}\na-table .a-table-predicted-box {\n  top: 0;\n  height: 100%;\n  position: absolute;\n  background-color: lightgrey;\n  box-shadow: inset 0px 0px 10px 2px rgba(0, 0, 0, 0.4);\n}\na-table table {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  align-content: stretch;\n}\na-table table thead {\n  overflow: hidden;\n}\na-table table thead .eq-thead-spacer {\n  padding: 0;\n  margin: 0;\n  border: none;\n  display: inline-block;\n}\na-table table tbody {\n  flex: 1;\n  overflow: auto;\n}\na-table table th.selected-cell,\na-table table td.selected-cell {\n  position: absolute;\n  visibility: hidden;\n  pointer-events: none;\n}\na-table table th.a-table-predicted-column,\na-table table td.a-table-predicted-column {\n  border: none !important;\n  background-color: transparent;\n  position: relative;\n}\n"},144:function(e,exports){e.exports="table {\n  width: 100%;\n  border: thin solid #444444;\n}\ntable thead th,\ntable thead td {\n  border-bottom: thin solid #444444;\n}\ntable tbody tr:first-child th,\ntable tbody tr:first-child td {\n  border-top: none;\n}\ntable td,\ntable th {\n  padding: 10px;\n  border-right: thin solid #444444;\n}\ntable td:not(th),\ntable th:not(th) {\n  border-top: thin solid #444444;\n}\ntable td > span,\ntable th > span {\n  width: 250px;\n  display: inline-block;\n}\n"},145:function(e,exports){e.exports='<div class=jumbotron><div class=container><h1>a Table</h1><p></p><p><a class="btn btn-default" role=button href=https://github.com/reyramos/table>Code on Github</a></p></div></div><div class=container><section class=bs-docs-section style="padding-top: 40px;height: 500px;"><a-table on-update=$ctrl.onColumnChange($event) columns=$ctrl.columns reorder=true><table><thead><tr><th ng-repeat="p in $ctrl.columns"><span><button ng-click="$ctrl.TheHead($event, p)">{{p.name}}</button></span></th></tr></thead><tbody><tr ng-repeat="row in $ctrl.rows"><td ng-repeat="thead in $ctrl.columns" nowrap><span ng-bind=row[thead.name]></span></td></tr></tbody></table></a-table></section></div>'},146:function(e,exports,t){var n=t(143);"string"==typeof n&&(n=[[e.i,n,""]]);t(24)(n,{});n.locals&&(e.exports=n.locals)},147:function(e,exports,t){var n=t(144);"string"==typeof n&&(n=[[e.i,n,""]]);t(24)(n,{});n.locals&&(e.exports=n.locals)},148:function(e,exports,t){t(2),e.exports=t(3)},16:function(e,exports){},18:function(e,exports){e.exports="<eq-nav></eq-nav><div ui-view></div>"},2:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0),o=t(14);t(16),exports.app=n.module("app",["ui.router","ngSanitize","oc.lazyLoad",t(10).name]),exports.app.config(["routeStateProvider",function(e){return new o.RouteProvider(e)}])},20:function(e,exports){e.exports=function(e){"use strict";function t(){e.register=angular.noop,this.currentModule=[],this.$get=["$document","$ocLazyLoad","$transitions",function(t,n,o){var i=this;return e.register=function(e){return this.currentModule=[],e.requires.forEach(function(e){i.currentModule.push(e),n.inject(e)}),n.load({name:e.name}).finally(function(){i.currentModule.push(e.name)})},{OnStateChangeStart:function(e){var t="function"==typeof e?e:function(){};o.onSuccess({to:"*"},function(e){t(i.currentModule,e.$to().name)})}}}]}function n(){this.$get=["$q",function(t){var n=function(n){var o=t.defer(),i=angular.isFunction(n)?n:angular.noop;return i.apply(this,[e,o.resolve]),o.promise};return n}]}e.run(["lcpLazyLoader",function(e){var t=[];e.OnStateChangeStart(function(e,n){var o=angular.element(document.body),i=function(e,n){if(n){var i=n.replace(/\./g,"_");t.push(i),o[e](i)}};t.forEach(function(e){o.removeClass(e)}),t.splice(0,t.length),i("addClass",e.join(" ")),i("addClass",n)})}]).provider("lcpLazyLoader",t).provider("jsBundleResolver",n)}},21:function(e,exports){e.exports=function(e){"use strict";function t(e){var t=[],n=e.get("$stateProvider","routeInjector"),o=e.get("$locationProvider","routeInjector"),i=e.get("$urlRouterProvider","routeInjector");this.inject=function(e){angular.forEach(e,function(e){var o=e.views||{};Object.keys(o).forEach(function(e){var t=o[e].templateUrl;t&&(o[e].templateUrl=angular.isArray(t)?t.join("/").replace(/\/\//g,"/"):t)}),e.data=Object.assign({},e.data,{debug:location.search.split("debug=")[1]||location.hash.split("debug=")[1]}),t.push(e),n.state(e)}),i.otherwise(function(e){e.get("$state").transitionTo("root")}),o.html5Mode(!1)},this.$get=["$rootScope",function(e){return{OnStateChangeStart:function(t){var n="function"==typeof t?t:function(){};e.$on("$stateChangeSuccess",function(e,t,o,i,r){n(t,o,i,r)})}}}]}e.run(["routeState",function(e){var t=[];e.OnStateChangeStart(function(e,n){var o=angular.element(document.body),i=e.name.replace(/\.?([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^_/,"");t.forEach(function(e){o.removeClass(e)}),t.splice(0,t.length),t.push(i),angular.element(document.body).addClass(i)})}]).provider("routeState",t),t.$inject=["$injector"]}},24:function(e,exports){function t(e,t){for(var n=0;n<e.length;n++){var o=e[n],i=d[o.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](o.parts[r]);for(;r<o.parts.length;r++)i.parts.push(l(o.parts[r],t))}else{for(var a=[],r=0;r<o.parts.length;r++)a.push(l(o.parts[r],t));d[o.id]={id:o.id,refs:1,parts:a}}}}function n(e){for(var t=[],n={},o=0;o<e.length;o++){var i=e[o],r=i[0],a=i[1],l=i[2],s=i[3],c={css:a,media:l,sourceMap:s};n[r]?n[r].parts.push(c):t.push(n[r]={id:r,parts:[c]})}return t}function o(e,t){var n=f(),o=b[b.length-1];if("top"===e.insertAt)o?o.nextSibling?n.insertBefore(t,o.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),b.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function i(e){e.parentNode.removeChild(e);var t=b.indexOf(e);t>=0&&b.splice(t,1)}function r(e){var t=document.createElement("style");return t.type="text/css",o(e,t),t}function a(e){var t=document.createElement("link");return t.rel="stylesheet",o(e,t),t}function l(e,t){var n,o,l;if(t.singleton){var d=v++;n=m||(m=r(t)),o=s.bind(null,n,d,!1),l=s.bind(null,n,d,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=a(t),o=u.bind(null,n),l=function(){i(n),n.href&&URL.revokeObjectURL(n.href)}):(n=r(t),o=c.bind(null,n),l=function(){i(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else l()}}function s(e,t,n,o){var i=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=g(t,i);else{var r=document.createTextNode(i),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(r,a[t]):e.appendChild(r)}}function c(e,t){var n=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function u(e,t){var n=t.css,o=t.sourceMap;o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([n],{type:"text/css"}),r=e.href;e.href=URL.createObjectURL(i),r&&URL.revokeObjectURL(r)}var d={},p=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},h=p(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),f=p(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,v=0,b=[];e.exports=function(e,o){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");o=o||{},"undefined"==typeof o.singleton&&(o.singleton=h()),"undefined"==typeof o.insertAt&&(o.insertAt="bottom");var i=n(e);return t(i,o),function(e){for(var r=[],a=0;a<i.length;a++){var l=i[a],s=d[l.id];s.refs--,r.push(s)}if(e){var c=n(e);t(c,o)}for(var a=0;a<r.length;a++){var s=r[a];if(0===s.refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete d[s.id]}}}};var g=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},25:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=t(0),o=n.module("app.public",[]),i=t(35),r=t(34),a=t(33),l=t(136);o.component("eqNav",new i.NavComponent),o.component("eqHome",new r.HomeComponent),o.component("eqAbout",new a.AboutComponent),o.component("eqContact",new l.ContactComponent),e.exports=o},3:function(e,exports){!function(e){"use strict";e.bootstrap(document,["app"],{})}(window.angular)},33:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e){this.$scope=e}return e}();n.$inject=["$scope"];var o=function(){function e(){this.template="About Page",this.controller=n}return e}();exports.AboutComponent=o},34:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e){this.$scope=e}return e}();n.$inject=["$scope"];var o=function(){function e(){this.template=t(45),this.controller=n}return e}();exports.HomeComponent=o},35:function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e){this.$element=e,e.addClass("navbar navbar-default navbar-fixed-top").css({position:"relative"})}return e}();n.$inject=["$element"];var o=function(){function e(){this.template=t(46),this.controller=n}return e}();exports.NavComponent=o},45:function(e,exports){e.exports="<a ui-sref=queryBuilder>Angular.js Query Builder</a><br><br>"},46:function(e,exports){e.exports='<nav class="navbar navbar-default navbar-static-top" style="margin: 0px;"><div class=container><div class=navbar-header><a class=navbar-brand href=#>Angular Data Table</a></div><div id=navbar class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ui-sref-active=active ui-sref=root><a ui-sref=root>Home</a></li><li ui-sref-active=active><a ui-sref=about>About</a></li><li ui-sref-active=active><a ui-sref=contact>Contact</a></li></ul></div></div></nav>'}},[148]);