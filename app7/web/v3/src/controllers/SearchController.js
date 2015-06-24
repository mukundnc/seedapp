function SearchController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qIdFrameModels = {};
	this.modelFactory = new ModelFactory();
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();}

SearchController.prototype.renderView = function(qid, apiRes){
	if(!this.qIdFrameModels[qid] && apiRes){
		this.qidResults[qid] = apiRes;
		this.qIdFrameModels[qid] = this.modelFactory.getFrameModel(apiRes, this.getModelOptions(apiRes));
	}

	var results = this.qidResults[qid];
	var frameModel = this.qIdFrameModels[qid];
	var searchFrameView = new SearchFrameView(frameModel, this.getViewOptions(results));
	searchFrameView.render()
}

SearchController.prototype.getModelOptions = function(apiRes){
	var dd = this.getDateDetails(apiRes);
	return {
		container : {
			width : this.W - 50,
			height : this.H * 0.25
		},
		timeline : {			
			startDate : dd.startDate,
			endDate : dd.endDate,
			dateDist : dd.dist,
			width : this.W - 50,
			height : this.H * 0.5,
		}
	};
}

SearchController.prototype.getViewOptions = function(apiRes){
	return {
		controller : this,
		resultCount : apiRes.results[0].hits.total,
		container : {
			controller : this,
			xOrg : 0,
			yOrg : this.H * 0.5,
			w : this.W - 50,
			h : this.H * 0.45
		},
		timeline : {
			controller : this,
			xOrg : 0,
			yOrg : this.H * 0.95,
			w : this.W - 50,
			h : this.H * 0.45
		}
	}
}

SearchController.prototype.getDateDetails = function(results){
	if(!results.query.filters){
		return {
			startDate : '2000/01/01',
			endDate : '2014/12/31',
			dist : 'yearly'
		}
	}
	var arr = [];
	var filters = results.query.filters.and.concat(results.query.filters.or);
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
