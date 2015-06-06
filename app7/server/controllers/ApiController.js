var logger = require('./../utils/Logger');
var QueryParser = require('./../query-parser/QueryParser');
var QueryRunner = require('./../query-runner/QueryRunner');
var DataManager = require('./../data-manager/DataManager');

function ApiController(){

}

ApiController.prototype.handleDefaultRequest = function(req, res){
	var queryRunner = new QueryRunner();
	queryRunner.getRoot(function(data){
		res.json(data);
	});
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
	queryRunner.run(parsedQueryObject, this.onExecuteQueryResponse.bind(this, parsedQueryObject, respHttp));
}

ApiController.prototype.onExecuteQueryResponse = function(parsedQueryObject, respHttp, respExecQuery){
	respExecQuery.query = parsedQueryObject;
	respHttp.json(respExecQuery);
}

ApiController.prototype.handleSaveSalesStrategyRequest = function(req, res){
	var dataMgr = new DataManager();
	dataMgr.saveSalesStrategy(req, res);
}

ApiController.prototype.handleBuildSalesIndicesRequest = function(req, res){
	var dataMgr = new DataManager();
	dataMgr.buildSalesIndices(req, res);
}

var gApiController = new ApiController();

module.exports = gApiController;