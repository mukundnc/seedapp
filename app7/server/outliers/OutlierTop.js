
var _ = require('underscore');
var OutlierHelper = require('./OutlierHelper');
var ResponseParser = require('./../utils/ResponseParser');

function OutlierTop(){
	this.timeDistribution = 'yearly';
	this.helper = new OutlierHelper();
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
	
	var olItems = this.helper.getOutlierItemsForLine(searchResults[0], line);
	this.markOutliersInObject(olItems, onDone);
	
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
			var timeItem = self.getTimeItemFromArray(objChild.items);
			self.timeDistribution = timeItem.key;
			timeItem.items.forEach(function(objChildTimeItem){
				timeKeyVsItem[objChildTimeItem.key] = objChildTimeItem;
				timeKeyVsCount[objChildTimeItem.key] = objChildTimeItem.doc_count;
			});
			self.helper.getOutlierFlagsForTimeItems(timeKeyVsCount, self.timeDistribution, function(err, timeKeyVsOutlierFlag){
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

OutlierTop.prototype.getTimeItemFromArray = function(arr){
	for(var i = 0 ; i < arr.length ; i++){
		if(this.helper.isTimeType(arr[i].key)){
			return arr[i];
		}
	}
	return null;
}

module.exports = OutlierTop;