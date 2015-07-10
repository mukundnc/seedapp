
var OutlierTop = require('./OutlierTop');
var ResponseParser = require('./../utils/ResponseParser');

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
	
}

OutlierManager.prototype.executeOutliersForTopMode = function(reqHttp, line, cbOnDone){
	var outlierTop = new OutlierTop();
	var onSearchQueryResponse = {
		json : function(res){
			outlierTop.getOutliersForTop(res, line, cbOnDone);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}

OutlierManager.prototype.executeOutliersForDrilldownMode = function(reqHttp, query, line, cbOnDone){
	var self = this;
	var onSearchQueryResponse = {
		json : function(res){
			self.onSearchQueryResponse(res, query, line, cbOnDone);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}

OutlierManager.prototype.onSearchQueryResponse = function(searchResults, query, line, cbOnDone){
	var respParser = new ResponseParser();
	var parsedResponse = respParser.parse(searchResults);
	
	if(!this.isDrilldownSupported(parsedResponse, line)){
		cbOnDone({success : false, message : 'Operation not supported'});
		return;
	}
	cbOnDone(parsedResponse);
}

OutlierManager.prototype.isDrilldownSupported = function(parsedResponse, line){
	var products = ['categories', 'types', 'brands'];
	var regions = ['regions'];
	var supported = {
		isProduct : false,
		isRegion : false
	};
	var keys = ['key1', 'key2'];
	keys.forEach(function(key){
		var src = parsedResponse[0][key];
		if(src){
			if(products.indexOf(src.key) !== -1){
				supported.isProduct = true;
			}
			if(regions.indexOf(src.key) !== -1){
				supported.isRegion = true;
			}
		}
	});
	return line === 'product' ? supported.isProduct : supported.isRegion;
}

OutlierManager.prototype.getAllDrilldownSearches = function(parsedResponse, query, line){
	var key = line === 'product' ? 'key1' : 'key2';
	var drillDownItems = parsedResponse[0][key].items;
	var drillDownSubjects = [];
	drillDownItems.forEach(function(ddItem){
		drillDownSubjects.push(ddItem.key);
	});
	var qSource = parsedResponse[0].queryDetails.qSource.value;

	var drillDownQueries = [];
	drillDownSubjects.forEach(function(ddSub){
		drillDownQueries.push(query.replace(qSource, ddSub));
	});
	return drillDownQueries;
}

module.exports = OutlierManager;