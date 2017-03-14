/**
 * Created by ramor11 on 3/14/2017.
 */
var tsConfig = require('./tsconfig.json');
var shell = require('shelljs');


var opts = tsConfig.compilerOptions;

var command = ["\"./node_modules/.bin/tsc\"",
	"src/js/table/index.ts --outDir build",
	"--allowUnreachableCode"];

Object.keys(opts).forEach(function (k) {
	command.push("--" + k);
	command.push(opts[k].toString());
});


shell.exec(command.join(" "));
