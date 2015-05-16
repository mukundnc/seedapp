var elasticsearch = require('elasticsearch');
var dictonary = require('./domainStrings');

function ESApp(){
	this.init();
	this.esUrl = 'http://localhost:9200/companysales/sales';
}

ESApp.prototype.init = function(){
	this.client = new elasticsearch.Client({
		host: 'localhost:9200',
		requestTimeout : 1000 * 60 *5
		//,log: 'trace'
	});
}


ESApp.prototype.executeQuery = function(antlrQueryObject, cbOnDone){
	console.log(JSON.stringify(antlrQueryObject));
	cbOnDone({success : true, results : {}});
}

var gESApp = new ESApp();

module.exports = gESApp;