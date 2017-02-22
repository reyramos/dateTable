import * as angular from "angular";
import {QUERY_OPERATORS, QUERY_CONDITIONS} from "./query.conditions";
import {QUERY_INTERFACE} from "./query.interface";
import {type} from "os";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;
declare let Array: any;
declare let String: any;


const QBKEY: string = "$$QueryBuilder";


String.prototype.replaceAt = function (index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
};

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};

class QueryBuilderCtrl implements ng.IComponentController {
    
    
    static $inject: Array<string> = ['$element', '$scope'];
    
    
    public maxChips = 1;
    public multi = false;
    
    public operators = QUERY_OPERATORS;
    public conditions: Array<any> = [];
    public group: any;
    public fields: any;
    public fieldDatatype: string;
    public queryString: string;
    public fieldValue: string;
    public fieldName: string;
    
    
    //output
    private onDelete: any;
    private onUpdate: any;
    private onFetch: any;
    
    //trackers
    private $event: any = "";
    private $queryString: string = "";
    private $outputUpdate: boolean = false;
    private $trigger: boolean = false;
    private $countCondition: number;
    private $timeoutPromise: any;
    //keep original group
    private $group: any;
    private $digestCycle: any;
    
    
    constructor(private $element, private $scope: ng.IScope) {
        let self: any = this;
        
        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            self.conditions.push(QUERY_CONDITIONS[k])
        })
        
    }
    
    $onInit() {
        if (!this.group) this.group = angular.copy(QUERY_INTERFACE);
        
        if (!this.fieldValue)
            this.fieldValue = 'value';
        
        if (!this.fieldName)
            this.fieldName = 'name';
        
        
        this.onGroupChange();
    }
    
    
    $doCheck() {
        let self: any = this;
        
        /*
         This will be trigger when the output string is changes from outside source
         other than query builder
         */
        if (!angular.equals(this.queryString, this.$queryString)) {
            this.$queryString = this.queryString;
            clearTimeout(this.$timeoutPromise);
            this.$timeoutPromise = setTimeout(() => {
                self.$outputUpdate = true;
                let obj = self.parseQuery(self.queryString);
                let group = angular.toJson(obj);
                
                self.group = JSON.parse(group);
                self.onGroupChange();
                self.$scope.$digest();
            }, 500);
        }
        
        if (this.$trigger && !angular.equals(this.group, this.$group)) {
            this.$group = angular.copy(this.group);
            this.$trigger = false;
            self.trigger('onUpdate')
        }
        
    };
    
    
    /**
     * It will take the query string and split into a simple single layer array to be evalualated
     * later to build the JSON filters based on the parameters
     * @param query
     */
    private split_string(query: string) {
        if (!query)return;
        
        
        let words = (query.trim()).split(/ /g);
        //array element to keep single
        let conditions: any = ["(", ")"];
        let self: any = this;
        let qArr = [];
        let string = "";
        let operands = [];
        
        /*
         Get all available conditions
         */
        this.conditions.map(function (c) {
            let lowerCase = (Array.isArray(c.symbol) ? c.symbol : [c.symbol]).map((o) => {
                return o.toLowerCase();
            });
            conditions = conditions.concat(lowerCase);
        });
        
        /*
         Get all the valid operand
         */
        this.fields.map(function (o) {
            operands.push(o[self.fieldName]);
        });
        
        this.operators.map(function (c) {
            let lowerCase = (Array.isArray(c.name) ? c.name : [c.name]).map((o) => {
                return o.toLowerCase();
            });
            conditions = conditions.concat(lowerCase);
        });
        
        conditions = conditions.unique();
        
        /*
         First check all the condition and match them together
         */
        let wCopy = words.filter((o) => {
            return o !== "";
        });
        
        /*
         Split strings with parenthesis
         */
        let _split = () => {
            let cQarr = wCopy.slice(0); //lets copy
            wCopy.forEach(function (o, i) {
                let regex = /\(|\)/g;
                let m = o.length > 1 ? regex.exec(o) : null;
                if (m) {
                    //push the match
                    wCopy.splice(m[0] === "(" ? i : i + 1, 0, m[0]);
                    //remove the match
                    let string = (o as any).replaceAt(m.index, "");
                    //replace the string
                    wCopy.splice(m[0] === ")" ? i : i + 1, 1, string);
                    
                }
            });
            
            if (wCopy.length !== cQarr.length) _split();
        };
        
        _split();
        words = wCopy.slice(0);
        
        let sCount = [];
        let position = 0;
        for (let i = 0; i < words.length; i++) {
            
            let test = words[i].trim();
            if (["(", ")"].indexOf(test) === -1) {
                string += " " + words[i];
                sCount.push(i); //keep count of string adds
                if (conditions.indexOf(test.toLowerCase()) > -1) {
                    //CHECK FOR ALL CONDITIONS AND OPERATORS
                    let isNot = words[i - 1] ? words[i - 1].toUpperCase() === "NOT" : false;
                    let cond = test;
                    if (isNot) {
                        cond = [words[i - 1], test].join(" ");
                        wCopy.splice(i, 1, cond);
                        wCopy.splice(i - 1, 1, QBKEY);
                    }
                    
                    let comp1 = string.replace(cond, "").trim();
                    let comp2 = words[i - 1] ? words[i - 1].trim() : null;
                    if (comp1 && [test, comp2].indexOf(comp1) < 0) {
                        wCopy.splice(i - 1, 1, comp1.trim());
                        sCount.forEach((idx) => {
                            if (idx < (i - 1)) wCopy.splice(idx, 1, QBKEY);
                        });
                    }
                    sCount = [];//reset
                    string = "";//reset on array changes
                    
                } else if (operands.indexOf(string.trim()) > -1) {
                    //CHECK FOR ALL OPERANDS
                    wCopy.splice(i, 1, string.trim());
                    sCount.forEach((idx) => {
                        if (idx < i) wCopy.splice(idx, 1, QBKEY);
                    });
                    
                    sCount = [];//reset
                    string = "";//reset on array changes
                }
            } else if (test === ")") {
                sCount = [];//reset
                string = "";//reset on array changes
            }
            
            
            position = i;
        }
        
        //CHECK FOR ALL OPERANDS
        if (string) wCopy.splice(position, 1, string.trim());
        sCount.forEach((idx) => {
            if (idx < position) wCopy.splice(idx, 1, QBKEY);
        });
        
        
        words = wCopy.filter((o) => {
            return o !== QBKEY;
        });
        
        /*
         This loop will handle the conditions
         TODO:refactor
         */
        var i = 0;
        let handler = []; //this should reset on push to qArr
        
        string = ""; //reset for new array use
        do {
            if (words[i]) {
                if (conditions.indexOf(words[i].toLowerCase()) < 0) {
                    let regex = /^and|AND|or|OR$`/g;
                    let cond = regex.exec(words[i]);
                    /*
                     Testing for condition where the user started typing
                     AND and OR uncomplete and define its group since its a broken word
                     */
                    if (cond) {
                        handler.push(string);
                        handler.push(words[i])
                    } else {
                        string += " " + words[i];
                    }
                    
                } else if (["(", ")"].indexOf(words[i].trim()) !== -1) {
                    handler.push(string);
                    string = "";
                    handler.push(words[i]);
                } else {
                    let regex = /(["'`])(\\?.)*?\1/g;
                    
                    let value = regex.exec(string);
                    if (value) {
                        handler.push(value.input);
                    } else {
                        handler.push(string);
                    }
                    
                    //push the condition being evalualated
                    if (words[i]) handler.push(words[i]);
                    if (handler.length > 3) {
                        qArr = qArr.concat(handler)
                        handler = [];
                    }
                    
                    string = "";
                }
            } else {
                handler.push(string);
            }
            i++;
        } while (i <= words.length);
        
        //wrapping last array string
        qArr = qArr.concat(handler);
        //clean empty strings
        qArr = qArr.filter(function (o) {
            return o !== ""
        });
        
        //clean strings
        qArr = qArr.map(function (o) {
            return o.trim()
        });
        
        
        return qArr;
        
    }
    
    private defineDatatype(dataType, values) {
        values = Array.isArray(values) ? values : [values];
        let num = (values.slice(0)).map((f) => {
            if (typeof f === 'string')return f.trim();
        });
        
        if (dataType)
            switch (dataType.toUpperCase()) {
                case 'NUMBER':
                case 'INTEGER':
                case 'FLOAT':
                    num = values.map((v) => {
                        return Number(v);
                    });
                    break;
                
            }
        
        
        return num;
    }
    
    
    /**
     * Take the String and parse it into OBJECT format
     * @param queryString
     * @returns {Object}
     */
    private parseQuery(queryString: string) {
        let self: any = this;
        //take the string and break into array
        let queryArray: Array<string> = this.split_string(queryString);
        
        let operators = [];
        /*
         Build the needed operators from the CONST
         */
        this.operators.map(function (c) {
            let lowerCase = (Array.isArray(c.name) ? c.name : [c.name]).map((o) => {
                return o.toLowerCase();
            });
            operators = operators.concat(lowerCase);
        });
        
        let conditions = [];
        /*
         Build a reference value of the QUERY_CONDITION constants
         */
        Object.keys(QUERY_CONDITIONS).forEach(function (k) {
            let symbol = QUERY_CONDITIONS[k].symbol;
            conditions.push({
                symbol: Array.isArray(symbol) ? symbol : [symbol],
                value : QUERY_CONDITIONS[k].value
            })
        });
        
        let newGroup = () => {
            let filters: any = angular.copy(QUERY_INTERFACE);
            
            Object.assign(filters, {
                expressions: []
            });
            
            return filters;
            
        };
        
        let newCondition = (exp: Array<string>) => {
            let expressions: any = angular.copy(QUERY_INTERFACE.expressions[0]);
            let regex = /(["'`])(\\?.)*?\1/g
            let val = regex.exec(exp[2]);
            let value = val ? exp[2].substring(1, exp[2].length - 1) : exp[2];
            let desc = regex.exec(exp[0]);
            let description = desc ? exp[0].substring(1, exp[0].length - 1) : exp[0];
            
            Object.assign(expressions, {
                values  : [],
                field   : self.fields.find(function (o) {
                    return description === o[self.fieldName];
                }),
                operator: conditions.find((o) => {
                    return o.symbol.indexOf(exp[1].toLowerCase()) !== -1 || o.symbol.indexOf(exp[1].toUpperCase()) !== -1
                }).value
            });
            
            let dataType: string = expressions.field.hasOwnProperty(this.fieldDatatype) ? expressions.field[this.fieldDatatype] : false;
            let values = this.defineDatatype(dataType, value.split(","));
            
            
            values.forEach((v) => {
                expressions.values.push(v);
            });
            
            //remove any empty strings
            expressions.values = expressions.values.filter(function (o) {
                return o !== "" && o !== "``"
            });
            
            return expressions;
        };
        
        
        let group = newGroup();
        let parseIt = (group, arr: Array<string>) => {
            
            let expressions = [];
            if (!arr)return;
            
            for (let i = 0; i < arr.length; i++) {
                let txt = arr[i];
                if (txt === "$$QueryBuilder")return;
                if (txt === "(") {
                    //defining the start of the group
                    let _group = newGroup();
                    
                    group.expressions.push(_group);
                    //clean empty strings
                    arr = arr.filter(function (o) {
                        return o !== "$$QueryBuilder"
                    });
                    
                    let reg = /(\()?(?:[^()]+|\([^)]+\))+(\)?)/;
                    let m = reg.exec(arr.join(" "));
                    if (m) {
                        
                        let balance = (m[0] as any).replace(/\(/, "").trim();
                        balance = balance.replaceAt(balance.length - 1, "").trim();
                        
                        let newStr = ((arr.join(" ")).replace(balance, "")).replace(/\(\s{1,}\)/, "").trim();
                        //since of array reference add unidentified index to keep the same loop in order
                        arr = ["$$QueryBuilder"].concat(this.split_string(newStr) || []);
                        let handler = this.split_string(balance) || [];
                        handler = handler.filter((o) => {
                            return o.trim();
                        });
                        expressions = [];
                        parseIt(_group, handler);
                    }
                    
                } else if (txt === ")") {
                    //defining the end of the group
                } else if (operators.indexOf(txt.toLowerCase()) === -1) {
                    //this is a condition
                    expressions.push(txt);
                    if (expressions.length === 3) group.expressions.push(newCondition(expressions));
                } else {
                    group.op = txt;
                    expressions = [];
                }
                
                //unique identifier
                arr[i] = "$$QueryBuilder";
            }
            
        };
        
        parseIt(group, queryArray);
        return group;
    }
    
    /**
     * Will take the query string and stringify
     * @param group
     * @returns {Array}
     */
    private stringifyQuery(group: any) {
        let self: any = this;
        
        if (!group) return;
        var str = [];
        angular.forEach(group.expressions, function (o, i) {
            if (o.type === 'condition') {
                // var values = o.values[0] ? o.values.join(", ") : "";
                
                if (!o.field || !o.field[self.fieldName])return;
                if (i !== 0) str.push(group.op)
                
                str.push(o.field[self.fieldName]);
                
                let dataType: string = o.field.hasOwnProperty(self.fieldDatatype) ? o.field[self.fieldDatatype] : false;
                let values = o.values[0] ? (self.defineDatatype(dataType, o.values)).join(", ") : "";
                
                
                let condition = self.conditions.find(function (q) {
                    return o.operator === q.value;
                }).symbol;
                
                str.push(Array.isArray(condition) ? condition[0] : condition);
                
                let ticks = "`";
                str.push(self.$outputUpdate ? values : ticks + values + ticks);
                
            } else {
                var comp = self.stringifyQuery(o);
                if (comp.length) {
                    if (str.length) str.push(group.op);
                    if (comp.length > 3) {
                        comp.unshift("(");
                        comp.push(")");
                    }
                    str = str.concat(comp);
                }
                
            }
        });
        
        return str
        
    }
    
    
    private setOperator(operator: string) {
        let self: any = this;
        
        switch (operator) {
            case QUERY_CONDITIONS.IN.value:
                self.multi = true;
                self.maxChips = 9999;
                break;
            case QUERY_CONDITIONS.BETWEEN.value:
                self.multi = true;
                self.maxChips = 2;
                break;
            default:
                self.multi = false;
                self.maxChips = 1;
                break;
        }
        
    }
    
    
    private safeApply(fn?: any) {
        let scope: any = this.$scope;
        clearTimeout(this.$digestCycle);
        this.$digestCycle = setTimeout(function () {
            var phase = scope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else if (!scope.$$phase) {
                scope.$apply(fn)
            }
        }, 0)
        
    }
    
    onOperandChange() {
        this.$event = 'onOperandChange';
        this.$outputUpdate = false;
        this.onGroupChange();
    }
    
    onKeyUp(e: any, rule?: any) {
        let self: any = this;
        let evnt: any = e.originalEvent || e;
        this.$event = 'onKeyUp';
        this.$trigger = true;
        this.$outputUpdate = false;
        
        this.onPrefetch(evnt, rule).then((e) => {
            self.onGroupChange();
        });
    }
    
    onTagsChange(e: any) {
        this.$event = 'onTagsChange';
        this.$outputUpdate = false;
        this.onGroupChange();
        this.safeApply();
    }
    
    onConditionChange(rule: any, e?: any) {
        this.$event = 'onConditionChange';
        this.setOperator(rule.operator);
        rule.values.splice(this.maxChips);
        this.onGroupChange();
    };
    
    
    private checkExpressions(group) {
        let self: any = this;
        let conditions = [];
        let values = [];
        group.expressions.forEach(function (o, i) {
            if (o.type === 'condition') {
                conditions.push(o);
                let hasValue: boolean = o.values ? o.values[0] : false;
                let hasOperand: boolean = o.field ? o.field[self.fieldValue] : false;
                if (hasValue && hasOperand) values.push(i)
                
            } else {
                self.checkExpressions(o)
            }
        });
        /*
         Add a new row for new field entry
         */
        if (conditions.length > 0 && values.length === conditions.length) {
            this.AddCondition(group, values[values.length - 1] + 1);
        } else if (conditions.length == 0) {
            this.AddCondition(group, 0);
        }
        
    }
    
    
    private onGroupChange(e?: any) {
        clearTimeout(this.$timeoutPromise);
        let self: any = this;
        this.$event = e || 'onGroupChange';
        this.checkExpressions(this.group);
        this.setFieldsDescription(this.group);
        this.trigger('onUpdate');
    }
    
    
    private setFieldsDescription(group) {
        let self: any = this;
        //depends where the change came from find by
        let findBy: string = self.$outputUpdate ? self.fieldName : self.fieldValue;
        group.expressions.forEach(function (condition, i) {
            if (condition.type === 'condition') {
                let found = self.fields.find(function (o) {
                    return condition.field[findBy] === o[findBy]
                });
                if (found) Object.assign(condition.field, found);
                
                
                let dataType: string = condition.field.hasOwnProperty(self.fieldDatatype) ? condition.field[self.fieldDatatype] : false;
                
                
            } else {
                self.setFieldsDescription(condition)
            }
        });
    };
    
    AddCondition(group, idx?: number) {
        let self: any = this;
        
        var condition = angular.copy(QUERY_INTERFACE.expressions[0], {
            $$indeed: self.$countCondition,
            values  : []
        });
        
        if (idx > -1) {
            group.expressions.splice(idx, 0, condition);
        } else {
            group.expressions.push(condition);
        }
        
    }
    
    AddGroup(e?: any) {
        this.$event = 'AddGroup';
        this.group.expressions.push(angular.copy(QUERY_INTERFACE));
    }
    
    RemoveGroup(e?: any) {
        this.$event = 'RemoveGroup';
        
        let self: any = this;
        this.onDelete({
            $event: {
                group: self.group
            }
        })
    }
    
    RemoveCondition(idx: number, e?: any) {
        this.$event = 'RemoveCondition';
        let self: any = this;
        this.$countCondition = 0;
        this.group.expressions.map(function (o) {
            if (o.type === 'condition') self.$countCondition++;
        });
        if (self.$countCondition === 1)return;
        self.group.expressions.splice(idx, 1);
        this.onGroupChange();
    }
    
    /**
     * OUTPUT
     */
    onDeleteGroup(e: any) {
        let self: any = this;
        let gCopy = this.group.expressions.slice(0);
        gCopy.forEach(function (o, i) {
            if (o.$$hashKey === e.group.$$hashKey && o.$$indeed === e.group.$$indeed)
                self.group.expressions.splice(i, 1)
        });
        
        this.onGroupChange();
    }
    
    onUpdateGroup(e: any) {
        this.trigger('onUpdate');
    }
    
    private CleanObject() {
        const regex = /\{"type":"condition".*?"values":\[\]\}/g;
        let str: string = angular.toJson(this.group);
        let m;
        
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach(function (match) {
                try {
                    let obj = JSON.parse("[" + match + "]");
                    obj.forEach(function (o) {
                        if (!o.values.length) {
                            let search = JSON.stringify(o).trim();
                            let re = str.split(search);
                            str = re.join("");
                        }
                    })
                } catch (e) {
                }
            });
        }
        //clean up the json
        str = str.replace(/,\]/g, "]").replace(/\[,/g, "[").replace(/,,/g, ",");
        return this.setDatatypes(JSON.parse(str));
    }
    
    private setDatatypes(group) {
        let self: any = this;
        group.expressions.forEach(function (o, i) {
            if (o.type === 'condition') {
                let dataType: string = o.field.hasOwnProperty(self.fieldDatatype) ? o.field[self.fieldDatatype] : false;
                o.values = o.values[0] ? self.defineDatatype(dataType, o.values) : [];
            } else {
                self.setDatatypes(o)
            }
        });
        
        return group;
    };
    
    
    trigger(event: string) {
        let self: any = this;
        let string: Array<string> = this.stringifyQuery(this.group);
        //update both if updated from object
        this.$queryString = this.queryString = string.join(' ');
        
        this.$outputUpdate = false;
        
        this[event]({
            $event: {
                group : self.CleanObject(),
                string: self.queryString
            }
        })
        
    }
    
    onPrefetch(e: any, rule?: any) {
        let self: any = this;
        
        return new Promise((resolve) => {
            let $event: any = {$event: e};
            if (rule) Object.assign($event, {
                group : rule,
                target: 'input'
            });
            
            if (e.$event)Object.assign($event, e);
            this.onFetch({
                $event: $event
            });
            
            /*
             It may loose focus on external library injections, ex: typeahead.js
             */
            $event.$event.target.focus();
            resolve(e.target);
        })
    }
    
    
    onValueChange(e: any) {
        this.$event = 'onValueChange';
        let self: any = this;
        let a = [];
        Object.keys(e).forEach((k) => {
            a.push(e[k]);
        });
        
        this.onPrefetch.apply(this, a).then((e) => {
            self.onGroupChange();
        });
    }
    
    $onDestroy() {
        clearTimeout(this.$timeoutPromise);
        clearTimeout(this.$digestCycle);
    }
}


require('./query.less');

export class QueryBuilder implements ng.IComponentOptions {
    public bindings: any;
    public template: any;
    public controller: any;
    
    
    constructor() {
        this.bindings = {
            onDelete     : '&',
            onUpdate     : '&',
            onFetch      : '&onValueChange',
            fieldValue   : '@?',
            fieldName    : '@?',
            fieldDatatype: '@?',
            queryString  : '=?',
            $$index      : '<',
            group        : '=',
            fields       : '<operands'
        };
        
        this.template = require('./query-builder.component.html');
        this.controller = QueryBuilderCtrl;
    }
}
