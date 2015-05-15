var antlrApp = require('./antlrApp');

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

	cbOnDone(antlResponse);
}

var gSalesApp = new SalesApp();

module.exports = gSalesApp;