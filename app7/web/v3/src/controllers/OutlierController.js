function OutlierController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
}

OutlierController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = this.sortResultsOnTime(apiRes);
	
	Object.keys(this.qidResults[qid].results).forEach(function(r){
		console.log(r);
	})
	
}

OutlierController.prototype.sortResultsOnTime = function(apiRes){
	var tKeys = Object.keys(apiRes.results);
	var arr = [];
	if(apiRes.timeDistribution === 'yearly'){
		arr = _.sortBy(tKeys, function(d){ return parseInt(d);});		
	}
	else if(apiRes.timeDistribution === 'monthly'){
		arr = _.sortBy(tKeys, this.getMonthIndex);
	}
	var sorted = {};
	arr.forEach(function(a){
		sorted[a] = apiRes.results[a];
	});
	apiRes.results = sorted;
	return apiRes;
}

OutlierController.prototype.getMonthIndex = function(monthStr){
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