'use strict';

import {PublicModule} from "./public";
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
                            app.register(PublicModule);
                            resolve();
                        });
                    });
                }]
            }
        }
    ];
}


