var rio = require("rio");
var _ = require('underscore');
var config = require('./../../config/config').rConfig;
var logger = require('./../utils/Logger');
var ResponseParser = require('./../utils/ResponseParser');

function OutlierTop(){
	this.timeDistribution = 'yearly';
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
			this.timeDistribution = objChild.items[1].key;
			objChild.items[1].items.forEach(function(objChildTimeItem){
				timeKeyVsItem[objChildTimeItem.key] = objChildTimeItem;
				timeKeyVsCount[objChildTimeItem.key] = objChildTimeItem.doc_count;
			});
			self.getOutlierFlagsForTimeItems(timeKeyVsCount, this.timeDistribution, function(err, timeKeyVsOutlierFlag){
				Object.keys(timeKeyVsOutlierFlag).forEach(function(timeKey){
					timeKeyVsItem[timeKey].outlier = timeKeyVsOutlierFlag[timeKey];
				});
				objChild.items.forEach(function(objChildTimeItem){
					var olItems1 = _.where(objChildTimeItem.items, {outlier : 1});
					var olItems2 = _.where(objChildTimeItem.items, {outlier : -1});
					objChildTimeItem.items = olItems1.concat(olItems2);
				});
				onDone();
			});			
		}
	});
}

OutlierTop.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount, timeDistribution, cbOnDone){
	var self = this;
	var outlierFlags = {};
	var strKeyVsTimeKey = {};
	var keys = Object.keys(timeKeyVsCount);

	var args = {
		data : [],
		forecastPeriod : 1,
		frequency : timeDistribution === 'yearly' ? 1  : 12,
		startYear : new Date(parseInt(keys[0])).getFullYear()
	};
	
	keys.forEach(function(timeKey){
		var strKey = self.getStrKeyForTimeKey(timeKey);
		strKeyVsTimeKey[strKey] = timeKey;
		outlierFlags[timeKey] = 0;
		args.data.push({
			key : strKey,
			value : parseInt(timeKeyVsCount[timeKey])
		})
	});
	if(args.data.length < 5){
		cbOnDone(null, outlierFlags);
		return;
	}

	function onDone(err, res){
		if(err){
			logger.log(err);
			cbOnDone(err, {});
			return;
		}
		else{
			var jRes = JSON.parse(res);
			Object.keys(jRes).forEach(function(strKey){
				outlierFlags[strKeyVsTimeKey[strKey]] = jRes[strKey];
			})
			cbOnDone(null, outlierFlags);
		}
	}

	rio.sourceAndEval(config.forecastFilePath, {
	    entryPoint: "execute",
	    data: args,
	    callback: onDone
	});
}

OutlierTop.prototype.getStrKeyForTimeKey = function(timeKey, timeDistribution){
	var dt = new Date(parseInt(timeKey));
	if(timeDistribution === 'yearly')
		return dt.getFullYear().toString();

	var year = dt.getFullYear().toString().substr(2,4);
	var map = {
		0 : 'Jan-',
		1 : 'Feb-',
		2 : 'Mar-',
		3 : 'Apr-',
		4 : 'May-',
		5 : 'Jun-',
		6 : 'Jul-',
		7 : 'Aug-',
		8 : 'Sep-',
		9 : 'Oct-',
		10 : 'Nov-',
		11 : 'Dec-'
	};
	return map[dt.getMonth()] + year;
}

module.exports = OutlierTop;