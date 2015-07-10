var rio = require("rio");
var config = require('./../../config/config').rConfig;
var logger = require('./../utils/Logger');
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
		this.executeOutliersForTopMode(reqHttp, line, cbOnDone)
	
}

OutlierManager.prototype.executeOutliersForTopMode = function(reqHttp, line, cbOnDone){
	var self = this;
	var onSearchQueryResponse = {
		json : function(res){
			self.getOutliersForTop(res, line, cbOnDone);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}

OutlierManager.prototype.getOutliersForTop = function(resSearchQuery, line, cbOnDone){
	if(!resSearchQuery.success){
		cbOnDone({success : false, message : 'Internal error whlie executing search'});
		return;
	}
	var respParser = new ResponseParser();
	var searchResults = respParser.parse(resSearchQuery);
	
	function onDone(){
		cbOnDone(searchResults);
	}
	
	if(line === 'product')
		this.markOutliersInObject(searchResults[0]['key1'], onDone);
	else
		this.markOutliersInObject(searchResults[0]['key2'], onDone);
	
}

OutlierManager.prototype.markOutliersInObject = function(obj, cbOnDone){
	var self = this;
	var nTotalItems = obj.items.length;
	var iCnt = 0;
	function onDone(){
		iCnt++;
		if(iCnt >= nTotalItems)
			cbOnDone();
	}
	obj.items.forEach(function(objChild){
		if(objChild.items.length > 1){
			var timeKeyVsItem = {};
			var timeKeyVsCount = {};
			objChild.items[1].items.forEach(function(objChildTimeItem){
				timeKeyVsItem[objChildTimeItem.key] = objChildTimeItem;
				timeKeyVsCount[objChildTimeItem.key] = objChildTimeItem.doc_count;
			});
			self.getOutlierFlagsForTimeItems(timeKeyVsCount, function(timeKeyVsOutlierFlag){
				Object.keys(timeKeyVsOutlierFlag).forEach(function(timeKey){
					timeKeyVsItem[timeKey].outlier = timeKeyVsOutlierFlag[timeKey];
				});
				onDone();
			});			
		}
	});
}

OutlierManager.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount, cbOnDone){
	var outlierFlags = {};
	var yearVsTimeKey = {};
	var args = {
		data : [],
		forecastPeriod : 1
	};
	Object.keys(timeKeyVsCount).forEach(function(timeKey){
		var year = new Date(parseInt(timeKey)).getFullYear().toString();
		yearVsTimeKey[year] = timeKey;
		outlierFlags[timeKey] = 0;
		args.data.push({
			key : year,
			value : parseInt(timeKeyVsCount[timeKey])
		})
	});
	function onDone(err, res){
		if(err){
			logger.log(err);
			cbOnDone({});
			return;
		}
		var jRes = JSON.parse(res);
		Object.keys(jRes).forEach(function(yearKey){
			outlierFlags[yearVsTimeKey[yearKey]] = jRes[yearKey];
		})
		cbOnDone(outlierFlags);
	}

	rio.sourceAndEval(config.forecastFilePath, {
	    entryPoint: "execute",
	    data: args,
	    callback: onDone
	});
}

module.exports = OutlierManager;