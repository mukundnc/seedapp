function CompareController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.modelFactory = new ModelFactory();
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
}

CompareController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;

	var results = this.qidResults[qid];
	var models = this.modelFactory.getCompareFrameModel(apiRes, this.getModelOptions(results.query));
}

CompareController.prototype.getModelOptions = function(query){
	var dd = this.getDateDetails(query);
	return {
		container : {
			width : this.W - 50,
			height : this.H * 0.25
		},
		timeline : {			
			startDate : dd.startDate,
			endDate : dd.endDate,
			dateDist : dd.dist,
			width : this.W + 50,
			height : this.H * 0.37,
		}
	};
}

CompareController.prototype.getViewOptions = function(resultCount, qid){
	return {
		controller : this,
		resultCount : resultCount,
		w : this.W,
		h : this.H,
		container : {
			qid : qid,
			controller : this,
			xOrg : 0,
			yOrg : this.H * 0.5,
			w : this.W - 50,
			h : this.H * 0.45
		},
		timeline : {
			qid : qid,
			controller : this,
			xOrg : 90,
			yOrg : this.H * 0.9,
			w : this.W + 50,
			h : this.H * 0.45
		}
	}
}

CompareController.prototype.getDateDetails = function(query){
	if(!query.filters){
		return {
			startDate : '2000/01/01',
			endDate : '2014/12/31',
			dist : 'yearly'
		}
	}
	var arr = [];
	var filters = query.filters.and.concat(results.query.filters.or);
	filters.forEach(function(f){
		if(f.filter.isDate){
			arr.push(f.filter.value);
		}
	});

	if(arr.length < 2)
		return {
			startDate : '2000/01/01',
			endDate : '2014/12/31',
			dist : 'yearly'
		}

	var details = {
		startDate : arr[0],
		endDate : arr[1],
		dist : 'yearly'
	};
	var diff = new Date(arr[1]) - new Date (arr[0]);
	var dDays = diff/(1000 * 60 * 60 * 24);

	if(dDays < 61)
		details.dist = 'daily'
	else if(dDays < 366)
		details.dist = 'monthly'

	return details;
}
