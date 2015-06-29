function CompareController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
	this.modelFactory = new ModelFactory();
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
}

CompareController.prototype.renderView = function(qid, apiRes){
	this.initModels(qid, apiRes);

	var searchFrameView = new SearchFrameView(this.qidModels[qid], this.getViewOptions(qid));
	searchFrameView.render()
}

CompareController.prototype.initModels = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;
	
	if(!this.qidModels[qid]){
		var results = this.qidResults[qid];
		var model = this.modelFactory.getCompareFrameModel(results, this.getModelOptions(results.query));
		var frameModels = [];
		Object.keys(model).forEach(function(key){
			var modelCopy = JSON.parse(JSON.stringify(model));
			modelCopy.type = model[key].type;
			modelCopy.label = model[key].label;
			frameModels.push(modelCopy);
		});
		this.qidModels[qid] = frameModels;
	}
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

CompareController.prototype.getViewOptions = function(qid){
	return {
		controller : this,
		w : this.W,
		h : this.H,
		isCompareView : true,
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
	var filters = query.filters.and.concat(query.filters.or);
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
