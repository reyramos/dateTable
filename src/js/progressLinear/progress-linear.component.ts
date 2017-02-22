/**
 * Created by ramor11 on 2/21/2017.
 */
require('./progress-linear.less');

export class ProgressLinear implements ng.IComponentOptions {
    public template: any;
    
    constructor() {
        this.template = require('./progress-linear.component.html');
    }
}
