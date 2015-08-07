function SearchController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qIdFrameModels = {};
	this.modelFactory = new ModelFactory();
	var vp = getViewPort()
	this.H = vp.height;
	this.W = vp.width;
}

SearchController.prototype.renderView = function(qid, apiRes){
	if(!this.qIdFrameModels[qid] && apiRes){
		this.qidResults[qid] = apiRes;
		this.qIdFrameModels[qid] = this.modelFactory.getFrameModel(apiRes, this.getModelOptions(apiRes));
	}

	var results = this.qidResults[qid];
	var frameModel = this.qIdFrameModels[qid];
	var searchFrameView = new SearchFrameView(frameModel, this.getViewOptions(results, qid));
	searchFrameView.render()
}

SearchController.prototype.getModelOptions = function(apiRes){
	var dd = getDatesFromQuery(apiRes.query);
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
			mode : getQueryPartSpendOrAvgMode(apiRes.query)
		}
	};
}

SearchController.prototype.getViewOptions = function(apiRes, qid){
	var labels = getLablesFormQueryResponse(apiRes);
	return {
		controller : this,
		pageTitle : labels.pageTitle,
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
			h : this.H * 0.45,
			yAxisTitle : labels.yAxisTitle
		}
	}
}

SearchController.prototype.executeSearch = function(queryParams){
	var apiRes = this.qidResults[queryParams.qid];	
	var queryStr = '';
	queryStr = getQueryString(queryParams, apiRes.query);	
	$('#tbSearch').val(queryStr)
	this.appController.executeQuery();
}


SearchController.prototype.getOutlierData = function(params, cbOnDataReceived){
	if(params.mode === 'drilldown'){
		var orgQuery = this.appController.getQueryById(params.qid);
		var apiRes = this.qidResults[params.qid];
		var qSource = apiRes.query.product;
		var qTarget = apiRes.query.supplier;
		if(apiRes.query.time.isPresent){
			params.query = qSource.values[0];
			if(qTarget.isPresent)
				params.query += (' in ' + qTarget.values[0]);
			params.query += ' in last 1 year ';
		}
		else{
			params.query = orgQuery + ' in last 1 year ';
		}
	}	 
	this.appController.getOutlierData(params, cbOnDataReceived);
}

