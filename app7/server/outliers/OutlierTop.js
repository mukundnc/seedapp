
var _ = require('underscore');
var OutlierHelper = require('./OutlierHelper');
var ResponseParser = require('./../utils/ResponseParser');

function OutlierTop(){
	this.timeDistribution = 'yearly';
	this.helper = new OutlierHelper();
}

OutlierTop.prototype.getOutliersForTop = function(resSearchQuery, line, cbOnDone){
	var self = this;
	if(!resSearchQuery.success){
		cbOnDone({success : false, message : 'Internal error whlie executing search'});
		return;
	}
	var respParser = new ResponseParser();
	var searchResults = respParser.parse(resSearchQuery);
	
	function onDone(outlierItems){
		var timeFormattedResults = self.getTimeFormattedResults(outlierItems);
		cbOnDone(timeFormattedResults);
	}
	
	var olItems = this.helper.getOutlierItemsForLine(searchResults[0], line);
	this.markOutliersInObject(olItems, onDone);
	
}

OutlierTop.prototype.markOutliersInObject = function(obj, cbOnDone){
	var self = this;
	var resIdOutlierItems = {};
	var id = 1;
	obj.items.forEach(function(childObj){
		resIdOutlierItems[id] = {
			key : childObj.key,
			items : self.getTimeItemFromArray(childObj.items)
		}
		id++;
	});
	var ids = Object.keys(resIdOutlierItems).reverse();
	var total = ids.length;
	var id = ids.pop();
	var oneOlItem = resIdOutlierItems[id];
	var iCnt = 0;

	function onDone(){
		iCnt++;
		if(iCnt > total){
			cbOnDone(resIdOutlierItems);
			return;
		}
		else{
			var olItems = _.filter(oneOlItem.items.items, function(d) {
				return d.outlier && d.outlier !== 0;
			});
			oneOlItem.items.items = olItems
			resIdOutlierItems[id] = JSON.parse(JSON.stringify(oneOlItem));
			id = ids.pop();
			if(id){
				oneOlItem = resIdOutlierItems[id];
				self.markOutliersInOneTimeItem(oneOlItem, onDone);
			}
			else
				onDone();
		}
	}
	this.markOutliersInOneTimeItem(oneOlItem, onDone);
}

OutlierTop.prototype.markOutliersInOneTimeItem = function(timeItem, cbOnDone){
	var timeKeyVsItem = {};
	var timeKeyVsCount = {};
	var tItems = timeItem.items.items;
	tItems = this.helper.addMissingItemsInTimeSeries(tItems, this.timeDistribution);
	tItems.forEach(function(tItem){
		timeKeyVsItem[tItem.key] = tItem;
		timeKeyVsCount[tItem.key] = tItem.doc_count;
	});	

	function onDone(err, res){
		if(err){
			cbOnDone({});
			return;
		}
		else{
			Object.keys(res).forEach(function(tKey){
				timeKeyVsItem[tKey].outlier = res[tKey];
			});
			cbOnDone(res);
		}
	}
	this.helper.getOutlierFlagsForTimeItems(timeKeyVsCount, this.timeDistribution, onDone);
}

OutlierTop.prototype.getTimeItemFromArray = function(arr){
	for(var i = 0 ; i < arr.length ; i++){
		if(this.helper.isTimeType(arr[i].key)){
			this.timeDistribution = arr[i].key;
			return arr[i];
		}
	}
	return null;
}

OutlierTop.prototype.getTimeFormattedResults = function(outlierItems){
	var self = this;
	var timeFormattedResults = {};
	for(var key in outlierItems){
		outlierItems[key].items.items.forEach(function(tItem){
			var strTKey = self.helper.getStrKeyForTimeKey(tItem.key, self.timeDistribution);
			if(!timeFormattedResults[strTKey])
				timeFormattedResults[strTKey] = [];
			tItem.label = outlierItems[key].key;
			timeFormattedResults[strTKey].push(tItem);
		});
	}
	return timeFormattedResults;
}

module.exports = OutlierTop;