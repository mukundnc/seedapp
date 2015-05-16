var antlrApp = require('./antlrApp');
var esApp = require('./esApp');

function SalesApp(){

}

SalesApp.prototype.executeQuery = function(req, cbOnDone){
	var query = this.getFormattedQueryStr(req);

	antlrApp.executeQuery(query, this.onAntlrResponse.bind(this, cbOnDone));
}


SalesApp.prototype.getFormattedQueryStr = function(req){
	var str = decodeURIComponent(req.query.q);
	return str.toLowerCase();
}

SalesApp.prototype.onAntlrResponse = function(cbOnDone, antlResponse){
	if(!antlResponse.success){
		cbOnDone(antlResponse);
		return;
	}

	esApp.executeQuery(antlResponse.results, cbOnDone);
}

var gSalesApp = new SalesApp();

module.exports = gSalesApp;