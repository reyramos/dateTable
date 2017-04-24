import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";

/**
 * Created by ramor11 on 2/2/2017.
 */

declare let window: any;
declare let $: any;

export interface IController {
    onMouseDrag?($event): void;
    onMouseComplete?($event): void;
    isDragging?: boolean;
}


export class Draggable implements ng.IDirective {
    restrict = 'A';
    require = '^aTable';
    
    private aTable: IController;
    private handlerMouseDown;
    private docMouseMove;
    private docMouseUp;
    private MouseDrag: Subscription;
    
    
    //collect the move distance total no from pageX or pageY
    // private onMouseDown: boolean = false;
    private totalDistanceX = 0;
    private totalDistanceY = 0;
    private lastSeenAtX = 0;
    private lastSeenAtY = 0;
    
    constructor() {
        this.docMouseMove = Observable.fromEvent(document, 'mousemove');
        this.docMouseUp = Observable.fromEvent(document, 'mouseup');
    }
    
    private OnHandlerMouseDown(event: MouseEvent) {
        // this.onMouseDown = true;
        this.totalDistanceX = 0;
        this.totalDistanceY = 0;
        this.lastSeenAtX = 0;
        this.lastSeenAtY = 0;
    };
    
    link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: IController) => {
        this.aTable = ctrl;
        let self = this;
        
        this.handlerMouseDown = Observable.fromEvent(element, 'mousedown');
        
        
        // element[0].addEventListener("mouseover", function (e) {
        //         console.log('onMouseOver', this)
        // });
        //
        
        element[0].addEventListener("mousedown", () => this.OnHandlerMouseDown);
        
        let mouseDragEvent = this.handlerMouseDown
            .map(event => {
                let rect = getRect();
                return {top: rect.top, left: rect.left};
            })
            .flatMap(
                offset => this.docMouseMove.map(event => {
                    this.aTable.isDragging = true;
                    
                    if (this.lastSeenAtX) this.totalDistanceX += event.pageX - this.lastSeenAtX;
                    this.lastSeenAtX = event.pageX;
                    
                    if (this.lastSeenAtY) this.totalDistanceY += event.pageY - this.lastSeenAtY;
                    this.lastSeenAtY = event.pageY;
                    
                    return {
                        ui   : {
                            top        : this.totalDistanceY,
                            left       : this.totalDistanceX,
                            lastSeenAtX: this.lastSeenAtX,
                            lastSeenAtY: this.lastSeenAtY,
                            element    : element
                        },
                        event: event
                    }
                }).takeUntil(this.docMouseUp)
            );
        
        
        this.MouseDrag = mouseDragEvent.subscribe({
            next: (e) => {
                ctrl.onMouseDrag.apply(ctrl, [e]);
            }
        });
        
        //broadcast when the mouse up is trigger
        this.docMouseUp.subscribe({
            next: (e) => {
                this.OnHandlerMouseDown(e);
                ctrl.onMouseComplete.apply(ctrl, [e]);
            }
        });
        
        function getRect() {
            let rect = element[0].getBoundingClientRect();
            let rT = rect.top + window.pageYOffset - document.documentElement.clientTop;
            let rL = rect.left + window.pageXOffset - document.documentElement.clientLeft;
            return {top: rT, left: rL};
        }
        
        
        scope.$on('$destroy', () => {
            if (this.MouseDrag) this.MouseDrag.unsubscribe();
            if (this.docMouseUp) this.docMouseUp.unsubscribe();
            element[0].removeEventListener("mousedown", () => this.OnHandlerMouseDown);
            
        })
        
    };
    
    
    static factory(): ng.IDirectiveFactory {
        const directive = () => new Draggable();
        directive.$inject = [];
        return directive;
    }
}
