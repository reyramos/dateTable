'use strict';

export module Public {

    export let routes: Array<any> = [
        {
            name    : 'rootBundle',
            abstract: true,
            url     : "/",
        },
        {
            name    : 'rootBundle.root',
            template: require('./views/index.html'),
            abstract: true,
            resolve : {
                register: ['jsBundleResolver', function (jsBundleResolver) {
                    return jsBundleResolver((app, resolve) => {
                        (require as any).ensure([], function () {
                            app.register(require('./public'));
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
        {
            name     : "about",
            url      : "about/",
            parent   : "rootBundle.root",
            component: 'eqAbout'
        },
        {
            name     : "contact",
            url      : "contact/",
            parent   : "rootBundle.root",
            component: 'eqContact'
        }
    ];
}


