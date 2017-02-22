/**
 * Created by Ramor11 on 9/6/2016.
 */
var path = require('path');
// Validates that the dist build was successful
// by serving the files in the "dist" directory
// via the simplest possible Express application
var express = require('express');
var compression = require('compression');
var port = 9000;
var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('http://localhost:' + port);
	}
});
