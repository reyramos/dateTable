'use strict';

import {app} from "./public";
import template from './views/index.html';

export module Public {
    
    export let routes: Array<any> = [
        {
            name    : 'rootBundle',
            abstract: true,
            url     : "/",
        },
        {
            name    : 'rootBundle.root',
            template: template,
            abstract: true,
            resolve : {
                register: ['jsBundleResolver', function (jsBundleResolver) {
                    return jsBundleResolver((app, resolve) => {
                        (require as any).ensure([], function () {
                            app.register(app);
                            resolve();
                        });
                    });
                }]
            }
        },
        // {
        //     name     : "root",
        //     parent   : "rootBundle.root",
        //     component: 'eqHome'
        // },
        // {
        //     name     : "about",
        //     url      : "about/",
        //     parent   : "rootBundle.root",
        //     component: 'eqAbout'
        // },
        // {
        //     name     : "contact",
        //     url      : "contact/",
        //     parent   : "rootBundle.root",
        //     component: 'eqContact'
        // }
    ];
}


