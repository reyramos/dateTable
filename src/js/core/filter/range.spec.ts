import * as angular from "angular";
import {app} from "../../app.module";


/**
 * Created by Ramor11 on 2/24/2017.
 */




describe('Range Filter', () => {
    var element,
        scope;
    
    // load the service's module
    beforeEach(app.name);
    
    beforeEach(inject(function ($rootScope, $compile) {
            // scope = $rootScope.$new();
            // element = angular.element([
            //     '<ul><li ng-repeat="p in [] | range:3 track by $index">{{$index}}</li></ul>'
            // ].join(' '));
            // $compile(element)(scope);
            // scope.$digest();
        })
    );
    
    // it('should have 3 li element', function () {
    //     var ele = element.find('li');
    //     expect(ele.length).toBe(3);
    // });

});
