/**
 * Created by redroger on 8/5/2015.
 */


'use strict';


export module DataTable {

    export let routes: Array<any> = [
        {
            name    : 'DataTable',
            parent  : "rootBundle.root",
            abstract: true,
            resolve : {
                /**
                 * LazyLoad application on needed route
                 */
                ModuleResolver: ['jsBundleResolver', function (jsBundleResolver) {
                    return jsBundleResolver(function (app, resolve) {
                        (require as any).ensure([], function () {
                            app.register(require('./demo'));
                            app.register(require('./index'));
                            resolve();
                        });
                    });
                }]
            }
        },
        {
            name     : "root",
            parent   : 'DataTable',
            component: 'demoComponent'
        }
    ];

}

