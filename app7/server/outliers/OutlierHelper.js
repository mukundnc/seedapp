var rio = require("rio");
var config = require('./../../config/config').rConfig;
var logger = require('./../utils/Logger');

function OutlierHelper(){

}

OutlierHelper.prototype.getOutlierItemsForLine = function(parsedResponse, line){
	var keys = ['key1', 'key2'];
	for(var i = 0 ; i < keys.length; i++){
		var key = keys[i];
		var src = parsedResponse[key];
		if(src){
			if(this.isProductType(src.key) && line === 'product'){
				return src;
			}
			else if(this.isRegionType(src.key) && line === 'region'){
				return src;
			}
		}
	}
	return [];
}

OutlierHelper.prototype.isProductType = function(pType){
	var products = ['categories', 'types', 'brands', 'models'];
	return products.indexOf(pType) !== -1;
}

OutlierHelper.prototype.isRegionType = function(rType){
	var regions = ['regions', 'states', 'cities'];
	return regions.indexOf(rType) !== -1;
}

OutlierHelper.prototype.isTimeType = function(tType){
	var times = ['yearly', 'monthly', 'daily'];
	return times.indexOf(tType) !== -1;
}

OutlierHelper.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount, timeDistribution, cbOnDone){
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
		var strKey = self.getStrKeyForTimeKey(timeKey, timeDistribution);
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

OutlierHelper.prototype.getStrKeyForTimeKey = function(timeKey, timeDistribution){
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

module.exports = OutlierHelper
