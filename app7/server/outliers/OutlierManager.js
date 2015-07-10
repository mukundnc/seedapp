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
	
	if(line === 'product')
		this.markOutliersInObject(searchResults[0]['key1']);
	else
		this.markOutliersInObject(searchResults[0]['key2']);
	cbOnDone(searchResults);
}

OutlierManager.prototype.markOutliersInObject = function(obj){
	var self = this;
	obj.items.forEach(function(objChild){
		if(objChild.items.length > 1){
			var timeKeyVsItem = {};
			var timeKeyVsCount = {};
			objChild.items[1].items.forEach(function(objChildTimeItem){
				timeKeyVsItem[objChildTimeItem.key] = objChildTimeItem;
				timeKeyVsCount[objChildTimeItem.key] = objChildTimeItem.doc_count;
			});
			var timeKeyVsOutlierFlag = self.getOutlierFlagsForTimeItems(timeKeyVsCount);
			Object.keys(timeKeyVsOutlierFlag).forEach(function(timeKey){
				timeKeyVsItem[timeKey].outlier = timeKeyVsOutlierFlag[timeKey];
			});
		}
	});
}

OutlierManager.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount){
	var i = 1;
	var outlierFlags = {};
	Object.keys(timeKeyVsCount).forEach(function(timeKey){
		outlierFlags[timeKey] = i;
		i++;
	});
	return outlierFlags;
}

module.exports = OutlierManager;