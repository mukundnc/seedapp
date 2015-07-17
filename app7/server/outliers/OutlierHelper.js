var rio = require("rio");
var _ = require('underscore');
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
				if(jRes[strKey] > 1000){					
					logger.log('***** Invalid forecast values in R');
					logger.log(args);
					logger.log(jRes);
					jRes[strKey] = 0;
				}
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

OutlierHelper.prototype.sortObjectOnTimeKeys = function(objWithTimeKeys, timeDistribution){
	var tKeys = Object.keys(objWithTimeKeys);
	var arr = [];
	if(timeDistribution === 'yearly'){
		arr = _.sortBy(tKeys, function(d){ return parseInt(d);});		
	}
	else if(timeDistribution === 'monthly'){
		arr = _.sortBy(tKeys, this.getMonthIndex);
	}
	var sorted = {};
	arr.forEach(function(a){
		sorted[a] = objWithTimeKeys[a];
	});
	return sorted;
}

OutlierHelper.prototype.getMonthIndex = function(monthStr){
	if(monthStr.indexOf('Jan') !== -1) return 1;
	if(monthStr.indexOf('Feb') !== -1) return 2;
	if(monthStr.indexOf('Mar') !== -1) return 3;
	if(monthStr.indexOf('Apr') !== -1) return 4;
	if(monthStr.indexOf('May') !== -1) return 5;
	if(monthStr.indexOf('Jun') !== -1) return 6;
	if(monthStr.indexOf('Jul') !== -1) return 7;
	if(monthStr.indexOf('Aug') !== -1) return 8;
	if(monthStr.indexOf('Sep') !== -1) return 9;
	if(monthStr.indexOf('Oct') !== -1) return 10;
	if(monthStr.indexOf('Nov') !== -1) return 11;
	if(monthStr.indexOf('Dec') !== -1) return 12;
}

OutlierHelper.prototype.addMissingItemsInTimeSeries = function(timeSeries, timeDistribution){
	var all = [];
	timeSeries.forEach(function(ts){
		var dt = new Date(ts.key);
		var y = dt.getFullYear();
		var m = dt.getMonth();
		timeDistribution === 'yearly' ? all.push(y) : all.push(m);
	});
	var min = timeDistribution === 'yearly' ? 2000 : 0;
	var max = timeDistribution === 'yearly' ? 2014 : 11;
	for(var i = min ; i <= max ; i++){
		if(all.indexOf(i) === -1){
			if(timeDistribution === 'yearly'){
				timeSeries.push({
					key : Date.parse(i + '/06/15'),
					key_as_string : i + '/06/15',
					doc_count : 0
				});
			}
			else if(timeDistribution === 'monthly'){
				timeSeries.push({
					key : Date.parse('2014/' + (i+1).toString() + '/15'),
					key_as_string : '2014/' + (i+1).toString() + '/15',
					doc_count : 0
				});
			}
		}
	}
	var sorted = _.sortBy(timeSeries, function(ts) { 
		return ts.key;
	});
	return sorted;
}
module.exports = OutlierHelper
