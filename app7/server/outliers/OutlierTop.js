var rio = require("rio");
var config = require('./../../config/config').rConfig;
var logger = require('./../utils/Logger');
var ResponseParser = require('./../utils/ResponseParser');

function OutlierTop(){

}

OutlierTop.prototype.getOutliersForTop = function(resSearchQuery, line, cbOnDone){
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

OutlierTop.prototype.markOutliersInObject = function(obj, cbOnDone){
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

OutlierTop.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount, cbOnDone){
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


module.exports = OutlierTop;