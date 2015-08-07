function CompareController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
	this.modelFactory = new ModelFactory();
	var vp = getViewPort()
	this.H = vp.height;
	this.W = vp.width;
}

CompareController.prototype.renderView = function(qid, apiRes){
	this.initModels(qid, apiRes);

	var searchFrameView = new SearchFrameView(this.qidModels[qid], this.getViewOptions(qid, this.qidResults[qid]));
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
			frameModels.push(model[key]);
		});
		this.qidModels[qid] = frameModels;
	}
}

CompareController.prototype.getModelOptions = function(query){
	var dd = getDatesFromQuery(query);
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
			mode : getQueryPartSpendOrAvgMode(query)
		}
	};
}

CompareController.prototype.getViewOptions = function(qid, apiRes){
	var labels = getLablesFormQueryResponse(apiRes);
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
			h : this.H * 0.45,
			pageTitle : labels.pageTitle
		},
		timeline : {
			qid : qid,
			controller : this,
			xOrg : 90,
			yOrg : this.H * 0.9,
			w : this.W + 50,
			h : this.H * 0.38,
			yAxisTitle : labels.yAxisTitle
		}
	}
}
