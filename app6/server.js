var express = require('express');
var app = new express();
var salesApp = require('./salesApp');

app.use(express.static('public'));

app.get('/data', onDataRequest);

function onDataRequest(req, res){

	function onQueryComplete(data){
		res.json(data);
	}

	salesApp.executeQuery(req, onQueryComplete);
}

var port = 9090;
app.listen(port);
console.log('server running at port - ' + port);