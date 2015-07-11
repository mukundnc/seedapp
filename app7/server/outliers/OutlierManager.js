
var OutlierTop = require('./OutlierTop');
var OutlierDrillDown = require('./OutlierDrillDown');
var ResponseParser = require('./../utils/ResponseParser');
var logger = require('./../utils/Logger');
var QueryParser = require('./../query-parser/QueryParser');

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

	function onDrilldownSearchExecutionComplete(allExecutedSearches){
		var outlierDrillDown = new OutlierDrillDown();
		//var t = [allExecutedSearches[0]];
		outlierDrillDown.getOutliersForDrillDown(allExecutedSearches, line, cbOnDone);
	}

	var onSearchQueryResponse = {
		json : function(res){
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

	var allDrillDownSearches = this.getAllDrilldownSearches(parsedResponse, query, line);
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
			if(this.isProductType(src.key)){
				supported.isProduct = true;
			}
			if(this.isRegionType(src.key)){
				supported.isRegion = true;
			}
		}
	}).bind(this));
	return line === 'product' ? supported.isProduct : supported.isRegion;
}

OutlierManager.prototype.getAllDrilldownSearches = function(parsedResponse, query, line){
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
			type : line === 'product' ? 'categories' : 'regions',
			label : ddSub
		}
		var ddQuery = this.getQueryString(qParams, qSource, qTarget);
		ddQuery += this.getFilterString(query);
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
			if(this.isProductType(src.key))
				items.product = src.items;
			if(this.isRegionType(src.key))
				items.region = src.items;
		}
	}).bind(this));
	return line === 'product' ? items.product : items.region;
}

OutlierManager.prototype.getQueryString = function(queryParams, qSource, qTarget){
	var regionTypes = ['regions', 'states', 'cities', 'region', 'state', 'city'];
	var productTypes = ['categories', 'types', 'brands', 'models', 'category', 'type', 'brand', 'model'];

	function isProductType(p){
		return productTypes.indexOf(p) !== -1;
	}

	function isRegionType(t){
		return regionTypes.indexOf(t) !== -1;
	}
	var q = '';
	if(!qTarget){
		if(isProductType(queryParams.type)){
			if(isProductType(qSource.key)){
				//Single word product drill down  search
				q = queryParams.label;
			}
			else{
				//product drilldown in region
				q = queryParams.label + ' in ' + qSource.value; 
			}
		}
		else{
			if(isRegionType(qSource.key)){
				//Single word region drill down  search
				q = queryParams.label;
			}
			else{
				//Org query now in region
				q = qSource.value  + ' in ' + queryParams.label;
			}
		}
	}
	else{
		if(isProductType(queryParams.type)){
			//Drilldown product in region search
			q = queryParams.label + ' in ' + qTarget.value;
		}
		else{
			//Org query now in region drilldown
			q = qSource.value  + ' in ' + queryParams.label;
		}
	}
	return q;
}

OutlierManager.prototype.getFilterString = function(query){
	var idxWhere = query.indexOf('where');
	if(idxWhere !== -1){
		return '  ' + query.substr(idxWhere, query.length);
	}
	return '';
}

OutlierManager.prototype.isProductType = function(pType){
	var products = ['categories', 'types', 'brands'];
	return products.indexOf(pType) !== -1;
}

OutlierManager.prototype.isRegionType = function(rType){
	var regions = ['regions', 'states'];
	return regions.indexOf(rType) !== -1;
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
				cbOnDone(executedSearches);
			}
		}
	}	
	var queryParser = new QueryParser();
	queryParser.parse(oneSearch.query, onParseResponse);
}


module.exports = OutlierManager;