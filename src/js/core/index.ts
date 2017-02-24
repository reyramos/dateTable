import IQService = angular.IQService;
import {Range} from "./filter/range";

/**
 * Created by reyra on 1/26/2017.
 */

var app = require('./module').app;


require('./providers/lazy-loader.provider')(app);
require('./providers/route-state.provider')(app);


app.filter('range', Range);

module.exports = app;
