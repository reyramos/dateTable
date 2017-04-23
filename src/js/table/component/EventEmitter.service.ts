/**
 * Created by reyra on 10/8/2016.
 */
'use strict';

declare let Rx: any;

export class EventEmitter {


    private hasOwnProp: any = {}.hasOwnProperty;
    private subjects: any;

    private createName(name) {
        return '$' + name;
    }

    constructor() {
        this.subjects = {};
    }


    emit(name: string, data?: any) {
        let fnName: string = this.createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        this.subjects[fnName].onNext(data);
    };

    listen(name: string, handler?: any) {
        let fnName: string = this.createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        return this.subjects[fnName].subscribe(handler);
    };

    dispose() {
        if (!this)return;

        let self: any = this;

        var subjects = this ? this.subjects : {};
        for (var prop in subjects) {
            if (self.hasOwnProp.call(subjects, prop)) {
                subjects[prop].dispose();
            }
        }

        this.subjects = {};
    };

}

