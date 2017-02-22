import IQService = angular.IQService;
/**
 * Created by reyra on 1/26/2017.
 */

var app = require('./module').app;


require('./providers/lazy-loader.provider')(app);
require('./providers/route-state.provider')(app);



module.exports = app;
