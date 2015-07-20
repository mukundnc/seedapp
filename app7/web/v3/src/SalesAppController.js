function SalesAppController (){
	this.init();
	this.searchController = new SearchController(this);
	this.noAggController = new NoAggSearchController(this);
	this.compareController = new CompareController(this);
	this.outlierController = new OutlierController(this);
	this.searchTreeView = new SearchTreeView({controller : this});
	this.queryIndex = 0;
	this.queryIndices = {};
	this.queryIdVsController = {};
}


SalesAppController.prototype.init = function(){
	$('#tbSearch').on('keydown', this.onKeyDown.bind(this));
	$('.search-icon').on('click', this.onSearchClick.bind(this));
}

SalesAppController.prototype.onKeyDown = function(e){
	if(e.keyCode !== 13) return;
	this.executeQuery();
}

SalesAppController.prototype.onSearchClick = function(){
	this.executeQuery();
}

SalesAppController.prototype.executeQuery = function(){
	var query = $('#tbSearch').val();
	var qid = this.getQueryId(query);
	var controller = this.getControllerForQueryId(qid);
	if(controller)
		controller.renderView(qid);
	else
		$.getJSON('/api/search?q=' + query, this.onQueryResponse.bind(this, qid));

}

SalesAppController.prototype.getQueryId = function(query){
	var qid = this.queryIndices[query];
	if(!qid){
		qid = 'q' + this.queryIndex;
		this.queryIndex++;
		this.queryIndices[query] = qid;
	}
	return qid;
}

SalesAppController.prototype.getControllerForQueryId = function(qid){
	return this.queryIdVsController[qid];
}

SalesAppController.prototype.onQueryResponse = function(qid, result){
	if(!result.success){
		console.error(result.message);
		return
	}
	
	this.queryIdVsController[qid] = this.getControllerForSearch(result);
	this.queryIdVsController[qid].renderView(qid, result);
	var treeText = this.getTreeText(result);
	this.searchTreeView.add({id : qid, name : treeText});
}

SalesAppController.prototype.onSearchNodeSelectionChange = function(qid){
	$('#tbSearch').val(this.getQueryById(qid));
	this.executeQuery();
}

SalesAppController.prototype.getQueryById = function(qid){
	for(var query in this.queryIndices){
		if(this.queryIndices[query] === qid)
			return query;
	}
}

SalesAppController.prototype.getTreeText = function(apiRes){
	if(apiRes.success){		
		if(Array.isArray(apiRes.results[0].qSource) || Array.isArray(apiRes.results[0].qTarget)){
			arr = [];
			var srcTarg = apiRes.results[0].qSource.concat(apiRes.results[0].qTarget);
			srcTarg.forEach(function(st){
				arr.push(strToFirstUpper(st.value))
			});
			return arr.join('-');
		}

		return strToFirstUpper(apiRes.results[0].qSource.value);
	}
	return 'No Results';
}

SalesAppController.prototype.getControllerForSearch = function(apiRes){
	if(_.contains(this.getTreeText(apiRes), '-')){			
		return this.compareController;
	}
		
	if(apiRes.results[0].aggregations)
		return this.searchController;

	return this.noAggController;
}

SalesAppController.prototype.getOutlierData = function(params, cbOnDataReceived){
	if(params.mode === 'top')
		this.getOutlierDataTopMode(params, cbOnDataReceived);
	else if(params.mode === 'drilldown')
		this.getOutlierDataDrilldownMode(params);

}

SalesAppController.prototype.getOutlierDataTopMode = function(params, cbOnDataReceived){
	var url = '/api/ol?q=' + this.getQueryById(params.qid) + '&mode=' + params.mode + '&line=' + params.line;
	showLoading();
	$.getJSON(url, function(data){
		hideLoading();
		cbOnDataReceived(data);
	});
}

SalesAppController.prototype.getOutlierDataDrilldownMode = function(params){
	var queryDisplay = 'outlier ' + params.line + ' ' + params.query;
	var qid = this.getQueryId(queryDisplay);	
	var controller = this.queryIdVsController[qid];
	if(controller){
		controller.renderView(params.qid, null);
		$('#tbSearch').val(queryDisplay);
		return;
	}

	var url = '/api/ol?q=' + params.query + '&mode=' + params.mode + '&line=' + params.line;
	showLoading();
	$.getJSON(url, (function(result){
		hideLoading();
		if(result.success){			
			$('#tbSearch').val(queryDisplay);
			this.queryIdVsController[qid] = this.outlierController;
			this.queryIdVsController[qid].renderView(qid, result);
			var treeText = 'outlier-' + result.qSource.value;
			if(result.qTarget)
				treeText += '-' + result.qTarget.value;
			this.searchTreeView.add({id : qid, name : strToFirstUpper(treeText)});
		}
		else{
			console.error(result.message);
		}
		
	}).bind(this));
}