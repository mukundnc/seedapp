var express = require('express');
var app = new express();
var antlrApp = require('./antlrApp');

app.use(express.static('public'));

app.get('/data', onDataRequest);

function onDataRequest(req, res){
	function onQueryComplete(data){
		res.json(res);
	}

	antlrApp.executeQuery(onQueryComplete);
}

function run(){
	function onQueryComplete(data){
		//console.log(data);
	}

	antlrApp.runTests();
}

run();

// var port = 9090;
// app.listen(port);
// console.log('server running at port - ' + port);