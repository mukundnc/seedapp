var rio = require("rio");
var _ = require('underscore');
var config = require('./../../config/config').rConfig;
var logger = require('./../utils/Logger');
var ResponseParser = require('./../utils/ResponseParser');
var OutlierTop = require('./OutlierTop');

function OutlierDrillDown(){
	this.timeDistribution = 'yearly';
}

OutlierDrillDown.prototype.getOutliersForDrillDown = function(drillDownSearchResults, line, cbOnDone){	
	var resParser = new ResponseParser();
	
	var resIdVsOutlierItems = {};
	
	drillDownSearchResults.forEach((function(dsr){
		
		dsr.response = resParser.parse(dsr.response)[0];
		
		var olItems = this.getOutlierItemsForLine(dsr.response, line);

		resIdVsOutlierItems[dsr.id] = olItems;

	}).bind(this));
	
	var self = this;
	function onDone(){
		var timeFormatedOutliers = self.getTimeFormattedOutliers(resIdVsOutlierItems);
		cbOnDone(timeFormatedOutliers);
	}
	this.markOutliersInItems(resIdVsOutlierItems, onDone);
}

OutlierDrillDown.prototype.getOutlierItemsForLine = function(parsedResponse, line){
	var keys = ['key1', 'key2'];
	for(var i = 0 ; i < keys.length; i++){
		var key = keys[i];
		var src = parsedResponse[key];
		if(src){
			if(this.isProductType(src.key) && line === 'product'){
				return src.items;
			}
			else if(this.isRegionType(src.key) && line === 'region'){
				return src.items
			}
		}
	}
	return [];
}

OutlierDrillDown.prototype.isProductType = function(pType){
	var products = ['categories', 'types', 'brands', 'models'];
	return products.indexOf(pType) !== -1;
}

OutlierDrillDown.prototype.isRegionType = function(rType){
	var regions = ['regions', 'states', 'cities'];
	return regions.indexOf(rType) !== -1;
}

OutlierDrillDown.prototype.markOutliersInItems = function(resIdVsOutlierItems, cbOnDone){
	var self = this;
	var ids = Object.keys(resIdVsOutlierItems).reverse();
	var total = ids.length;
	var iCnt = 0;
	var id = ids.pop();
	function onOneDone(){
		iCnt++;
		if(iCnt >= total){
			cbOnDone();
			return;
		}
		else{
			id = ids.pop();
			self.markOutlierInOneItem(resIdVsOutlierItems[id], onOneDone);
		}
	}	
	this.markOutlierInOneItem(resIdVsOutlierItems[id], onOneDone);
}

OutlierDrillDown.prototype.markOutlierInOneItem = function(outlierItem, cbOnDone){
	var self = this;
	var nTotalItems = outlierItem.length;
	var iCnt = 0;
	function onDone(success){
		//if(!success) cbOnDone();

		iCnt++;
		if(iCnt >= nTotalItems){
			cbOnDone();
		}
	}
	outlierItem.forEach(function(objChild){
		var timeKeyVsItem = {};
		var timeKeyVsCount = {};
		objChild.items.forEach(function(objChildTimeItem){
			self.timeDistribution = objChildTimeItem.key;
			objChildTimeItem.items.forEach(function(tItem){
				timeKeyVsItem[tItem.key] = tItem;
				timeKeyVsCount[tItem.key] = tItem.doc_count;
			});			
		});
		self.getOutlierFlagsForTimeItems(timeKeyVsCount, function(timeKeyVsOutlierFlag){
			var keys = Object.keys(timeKeyVsOutlierFlag)
			keys.forEach(function(timeKey){
				timeKeyVsItem[timeKey].outlier = timeKeyVsOutlierFlag[timeKey];
			});
			objChild.items.forEach(function(objChildTimeItem){
				var olItems1 = _.where(objChildTimeItem.items, {outlier : 1});
				var olItems2 = _.where(objChildTimeItem.items, {outlier : -1});
				objChildTimeItem.items = olItems1.concat(olItems2);
			});
			onDone(keys.length);
		});	
		
	});
}

OutlierDrillDown.prototype.getOutlierFlagsForTimeItems = function(timeKeyVsCount, cbOnDone){
	function onDone(err, res){
		if(err){
			cbOnDone({});
			return;
		}
		else{
			cbOnDone(res);
		}
	}
	var outlierTop = new OutlierTop();
	outlierTop.getOutlierFlagsForTimeItems(timeKeyVsCount, this.timeDistribution, onDone);
}

OutlierDrillDown.prototype.getTimeFormattedOutliers = function(resIdVsOutlierItems){
	var outlierTop = new OutlierTop();
	var timeFormattedResults = {};
	for(var key in resIdVsOutlierItems){
		var topArr = resIdVsOutlierItems[key];
		topArr.forEach(function(firstLChild){
			firstLChild.items.forEach(function(secondLChild){
				secondLChild.items.forEach(function(thirdLChild){
					var year = outlierTop.getStrKeyForTimeKey(thirdLChild.key);
					if(!timeFormattedResults[year])
						timeFormattedResults[year] = [];
					thirdLChild.label = firstLChild.key;
					timeFormattedResults[year].push(thirdLChild);
				});
			});
		});
	}
	return timeFormattedResults;
}

module.exports = OutlierDrillDown