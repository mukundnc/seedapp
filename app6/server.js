var express = require('express');
var app = new express();
var salesApp = require('./salesApp');

app.use(express.static('public'));

app.get('/api/search', onDataRequest);
app.get('/run', onRunTestRequest);

function onDataRequest(req, res){

	function onQueryComplete(data){
		res.json(data);
	}

	salesApp.executeQuery(req, onQueryComplete);
}

function onRunTestRequest(req, res){
	salesApp.runAllTests();
	res.send('done');
}

var port = 9090;
app.listen(port);
console.log('server running at port - ' + port);
