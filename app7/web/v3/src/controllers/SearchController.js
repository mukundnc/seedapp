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
	var searchFrameView = new SearchFrameView(frameModel, this.getViewOptions(results, qid));
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
			width : this.W + 50,
			height : this.H * 0.37,
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

SearchController.prototype.executeSearch = function(queryParams){
	var queryStr = this.getQueryString(queryParams);
	$('#tbSearch').val(queryStr)
	this.appController.executeQuery();
}

SearchController.prototype.getQueryString = function(queryParams){
	var apiRes = this.qidResults[queryParams.qid];	
	var orgQuery = apiRes.query.query;
	var qSource = apiRes.results[0].qSource;
	var qTarget = apiRes.results[0].qTarget;
	var regionTypes = ['regions', 'states', 'cities'];
	var productTypes = ['categories', 'types', 'brands', 'models'];

	function isProductType(p){
		return productTypes.indexOf(p) !== -1;
	}

	function isRegionType(t){
		return regionTypes.indexOf(t) !== -1;
	}
	var q = '';
	if(!qTarget){
		if(isProductType(queryParams.type)){
			//Single word drill down product search
			q = queryParams.label;
		}
		else{
			//Org query now in region
			q = qSource.value  + ' in ' + queryParams.label;
		}
	}
	else{
		if(isProductType(queryParams.type)){
			//Drilldown product in region search
			q = queryParams.label + ' in ' + qTarget.value;
		}
		else{
			//Org query now in region drilldown
			q = qSource.value  + ' in ' + queryParams.label;
		}
	}
	q += this.getTimeFilterSuffix(queryParams);
	return q;
}

SearchController.prototype.getTimeFilterSuffix = function(queryParams){
	if(queryParams.source !== 'timeline') return '';
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
		return ' where date from ' + year + '/' + month + '/01 and date to ' + year + '/' + month + '/' + date;
	}
	else{
		return ' where date from ' + queryParams.tKey + '/01/01 and date to ' + queryParams.tKey + '/12/31';
	}
}