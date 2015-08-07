
var OutlierTop = require('./OutlierTop');
var OutlierDrillDown = require('./OutlierDrillDown');
var ResponseParser = require('./../utils/ResponseParser');
var logger = require('./../utils/Logger');
var QueryParser = require('./../query-parser/QueryParser');
var utils = require('./../utils/Utils');

function OutlierManager(apiController){
	this.apiController = apiController;
}

OutlierManager.prototype.handleOutlierRequest = function(reqHttp, resHttp){
	function cbOnDone(data){
		resHttp.json(data);
	}
	var query = decodeURIComponent(reqHttp.query.q).toLowerCase();	
	var mode = decodeURIComponent(reqHttp.query.mode).toLowerCase();	
	var line = decodeURIComponent(reqHttp.query.line).toLowerCase();	
	if(mode === 'top')
		this.executeOutliersForTopMode(reqHttp, line, cbOnDone);
	else if(mode === 'drilldown')
		this.executeOutliersForDrilldownMode(reqHttp, query, line, cbOnDone);
	else
		cbOnDone({success:false, message : 'Operation not supported'});	
}

OutlierManager.prototype.executeOutliersForTopMode = function(reqHttp, line, cbOnDone){	
	var onSearchQueryResponse = {
		json : function(res){
			var outlierTop = new OutlierTop();
			outlierTop.getOutliersForTop(res, line, cbOnDone);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}

OutlierManager.prototype.executeOutliersForDrilldownMode = function(reqHttp, query, line, cbOnDone){
	var self = this;	
	var rootSearchResponse = {};
	function onDrilldownSearchExecutionComplete(result){
		if(!result.success){
			cbOnDone(result);
			return
		}
		var outlierDrillDown = new OutlierDrillDown();
		//var t = [allExecutedSearches[0]];
		outlierDrillDown.getOutliersForDrillDown(result.data, rootSearchResponse, line, cbOnDone);
	}

	var onSearchQueryResponse = {
		json : function(res){
			rootSearchResponse = res;
			self.buildAndExecuteDrilldownSearches(res, query, line, onDrilldownSearchExecutionComplete);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}

OutlierManager.prototype.buildAndExecuteDrilldownSearches = function(searchResults, query, line, cbOnDone){
	var respParser = new ResponseParser();
	var parsedResponse = respParser.parse(searchResults);
	
	if(!this.isDrilldownSupported(parsedResponse, line)){
		cbOnDone({success : false, message : 'Operation not supported'});
		return;
	}

	var allDrillDownSearches = this.getAllDrilldownSearches(parsedResponse, query, line, searchResults.query.spend.isPresent);
	logger.log(allDrillDownSearches);

	var allSearchDetails = [];
	var i = 1;
	allDrillDownSearches.forEach(function(searchQuery){
		allSearchDetails.push({
			id : i,
			query : searchQuery.toLowerCase(),
			response : null
		});
		i++;
	});
	this.executeAllDrilldownSearches(allSearchDetails, line, cbOnDone);
}

OutlierManager.prototype.isDrilldownSupported = function(parsedResponse, line){
	var supported = {
		isProduct : false,
		isRegion : false
	};
	var keys = ['key1', 'key2'];
	keys.forEach((function(key){
		var src = parsedResponse[0][key];
		if(src){
			if(utils.isProductType(src.key) && line === 'product'){
				supported.isProduct = true;
			}
			if(utils.isRegionType(src.key) && line === 'region'){
				supported.isRegion = true;
			}
		}
	}).bind(this));
	return line === 'product' ? supported.isProduct : supported.isRegion;
}

OutlierManager.prototype.getAllDrilldownSearches = function(parsedResponse, query, line, isSpendPresent){
	var drillDownItems = this.getDrilldownItemsForLine(parsedResponse, line);
	var drillDownSubjects = [];
	drillDownItems.forEach(function(ddItem){
		drillDownSubjects.push(ddItem.key);
	});
	var qSource = parsedResponse[0].queryDetails.qSource;
	var qTarget = parsedResponse[0].queryDetails.qTarget;

	var drillDownQueries = [];
	drillDownSubjects.forEach((function(ddSub){
		var qParams = {
			type : line === 'product' ? 'lines' : 'countries',
			label : ddSub
		}
		var ddQuery = utils.getQueryString(qParams, qSource, qTarget, isSpendPresent);
		ddQuery += ' in last 1 year';
		drillDownQueries.push(ddQuery);
	}).bind(this));
	return drillDownQueries;
}

OutlierManager.prototype.getDrilldownItemsForLine = function(parsedResponse, line){
	var items = {
		product : [],
		region : []
	};
	var keys = ['key1', 'key2'];
	keys.forEach((function(key){
		var src = parsedResponse[0][key];
		if(src){
			if(utils.isProductType(src.key))
				items.product = src.items;
			if(utils.isRegionType(src.key))
				items.region = src.items;
		}
	}).bind(this));
	return line === 'product' ? items.product : items.region;
}

OutlierManager.prototype.executeAllDrilldownSearches = function(allSearchDetails, line, cbOnDone){
	var self = this;
	allSearchDetails = allSearchDetails.reverse();
	var oneSearch = allSearchDetails.pop();
	var executedSearches = [];
	
	function onParseResponse(resParseQuery){
		self.apiController.executeQuery(resParseQuery.data, onExecuteQueryResponse);
	}

	var onExecuteQueryResponse = {
		json : function(resExecuteQuery){
			oneSearch.response = resExecuteQuery;
			executedSearches.push(JSON.parse(JSON.stringify(oneSearch)));
			oneSearch = allSearchDetails.pop();			
			if(oneSearch){
				var queryParser = new QueryParser();
				queryParser.parse(oneSearch.query, onParseResponse);
			}
			else{
				cbOnDone({
					success : true,
					data : executedSearches
				});
			}
		}
	}	
	var queryParser = new QueryParser();
	queryParser.parse(oneSearch.query, onParseResponse);
}


module.exports = OutlierManager;