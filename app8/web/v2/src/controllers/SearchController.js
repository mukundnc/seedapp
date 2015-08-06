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
	// var searchFrameView = new SearchFrameView(frameModel, this.getViewOptions(results, qid));
	// searchFrameView.render()
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
			mode : this.getMode(apiRes.query)
		}
	};
}

SearchController.prototype.getViewOptions = function(apiRes, qid){
	return {
		controller : this,
		resultCount : apiRes.results[0].hits.total,
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

SearchController.prototype.getMode = function(query){
	var mode = 'count';
	if(query.spend.isPresent){
		if(query.average.isPresent)
			mode = 'average_spend';
		else
			mode = 'spend';
	}
	return mode;
}

SearchController.prototype.executeSearch = function(queryParams){
	var apiRes = this.qidResults[queryParams.qid];	
	var qSource = apiRes.results[0].qSource;
	var qTarget = apiRes.results[0].qTarget;
	var queryStr = '';
	if(queryParams.source === 'timeline'){
		queryStr = getQueryString(queryParams, qSource, qTarget, null);
		queryStr += this.getTimeFilterSuffix(queryParams);
	}
	else{
		var filters  = apiRes.query.filters? apiRes.query.filters.and : null;
		queryStr = getQueryString(queryParams, qSource, qTarget, filters);
	}
	
	$('#tbSearch').val(queryStr)
	this.appController.executeQuery();
}

SearchController.prototype.getTimeFilterSuffix = function(queryParams){
	var map = {
		'Jan' : { m : 1, d : 31},
		'Feb' : { m : 2, d : 28},
		'Mar' : { m : 3, d : 31},
		'Apr' : { m : 4, d : 30},
		'May' : { m : 5, d : 31},
		'Jun' : { m : 6, d : 30},
		'Jul' : { m : 7, d : 31},
		'Aug' : { m : 8, d : 31},
		'Sep' : { m : 9, d : 30},
		'Oct' : { m : 10, d : 31},
		'Nov' : { m : 11, d : 30},
		'Dec' : { m : 12, d : 31}
	};
	if(queryParams.tKey.indexOf('-') !== -1){
		var arr = queryParams.tKey.split('-');
		var year = 2000 + parseInt(arr[1]);
		var month = map[arr[0]].m;
		var date = map[arr[0]].d;
		return ' between ' + year + '/' + month + '/01 and ' + year + '/' + month + '/' + date;
	}
	else{
		return ' between ' + queryParams.tKey + '/01/01 and ' + queryParams.tKey + '/12/31';
	}
}
SearchController.prototype.getOutlierData = function(params, cbOnDataReceived){
	if(params.mode === 'drilldown'){
		var orgQuery = this.appController.getQueryById(params.qid);
		var apiRes = this.qidResults[params.qid];
		var qSource = apiRes.results[0].qSource;
		var qTarget = apiRes.results[0].qTarget;
		var filters = apiRes.query.filters? apiRes.query.filters.and : null;
		if(filters && filters.length > 1){
			params.query = qSource.value;
			if(qTarget)
				params.query += (' in ' + qTarget.value);
			params.query += ' in last 1 year ';
		}
		else{
			params.query = orgQuery + ' in last 1 year ';
		}
	}	 
	this.appController.getOutlierData(params, cbOnDataReceived);
}

