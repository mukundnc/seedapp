var _ = require('underscore');
var ResponseParser = require('./../utils/ResponseParser');
var OutlierHelper = require('./OutlierHelper');

function OutlierDrillDown(){
	this.timeDistribution = 'yearly';
	this.helper = new OutlierHelper();
}

OutlierDrillDown.prototype.getOutliersForDrillDown = function(drillDownSearchResults, rootSearchResults, line, cbOnDone){	
	var resParser = new ResponseParser();
	
	var resIdVsOutlierItems = {};
	
	drillDownSearchResults.forEach((function(dsr){
		
		dsr.response = resParser.parse(dsr.response)[0];
		
		var olItems = this.helper.getOutlierItemsForLine(dsr.response, line);

		resIdVsOutlierItems[dsr.id] = olItems.items;

	}).bind(this));
	
	var self = this;
	function onDone(){
		var timeFormatedOutliers = self.getTimeFormattedOutliers(resIdVsOutlierItems);
		cbOnDone({
			success : true,
			query : rootSearchResults.query,
			qSource : rootSearchResults.results[0].qSource,
			qTarget : rootSearchResults.results[0].qTarget,
			results : timeFormatedOutliers
		});
	}
	this.markOutliersInItems(resIdVsOutlierItems, onDone);
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
		iCnt++;
		if(iCnt >= nTotalItems){
			cbOnDone();
		}
	}
	outlierItem.forEach(function(objChild){
		var timeKeyVsItem = {};
		var timeKeyVsCount = {};
		objChild.items.forEach(function(objChildTimeItem){
			if(self.helper.isTimeType(objChildTimeItem.key)){
				self.timeDistribution = objChildTimeItem.key;
				objChildTimeItem.items.forEach(function(tItem){
					timeKeyVsItem[tItem.key] = tItem;
					timeKeyVsCount[tItem.key] = tItem.doc_count;
				});	
			}		
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
	this.helper.getOutlierFlagsForTimeItems(timeKeyVsCount, this.timeDistribution, onDone);
}

OutlierDrillDown.prototype.getTimeFormattedOutliers = function(resIdVsOutlierItems){
	var self = this;
	var timeFormattedResults = {};
	for(var key in resIdVsOutlierItems){
		var topArr = resIdVsOutlierItems[key];
		topArr.forEach(function(firstLChild){
			firstLChild.items.forEach(function(secondLChild){
				secondLChild.items.forEach(function(thirdLChild){
					var year = self.helper.getStrKeyForTimeKey(thirdLChild.key, self.timeDistribution);
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