var logger = require('./../utils/Logger');
var QueryParser = require('./../query-parser/QueryParser');

function ApiController(){

}

ApiController.prototype.handleDefaultRequest = function(req, res){
	res.send('welcome to search api.')
}

ApiController.prototype.handleSearchRequest = function(req, res){
	var queryParser = new QueryParser();
	var query = decodeURIComponent(req.query.q).toLowerCase();	
	queryParser.parse(query, this.onQueryParseResponse.bind(this, res));	
}

ApiController.prototype.onQueryParseResponse = function(respHttp, respQueryParse){
	if(!respQueryParse.success){
		respHttp.json(respQueryParse);
		return;
	}

	respHttp.json(respQueryParse);
}

var gApiController = new ApiController();

module.exports = gApiController;