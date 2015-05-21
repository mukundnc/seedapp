var logger = require('./../utils/Logger');
var QueryParser = require('./../query-parser/QueryParser');
var QueryRunner = require('./../query-runner/QueryRunner');

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

	this.executeQuery(respQueryParse.data, respHttp);
}

ApiController.prototype.executeQuery = function(parsedQueryObject, respHttp){
	var queryRunner = new QueryRunner();
	queryRunner.run(parsedQueryObject, this.onExecuteQueryResponse.bind(this, respHttp));
}

ApiController.prototype.onExecuteQueryResponse = function(respHttp, respExecQuery){
	respHttp.json(respExecQuery);
}

var gApiController = new ApiController();

module.exports = gApiController;