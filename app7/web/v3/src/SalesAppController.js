function SalesAppController (){
	this.init();
	this.searchController = new SearchController(this);
	this.noAggController = new NoAggSearchController(this);
	this.compareController = new CompareController(this);
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
		if(apiRes.results.aggregations && apiRes.results.hits.hits.length > 0 && !apiRes.query)
			return 'Home';

		var k = Object.keys(apiRes.results[0].qSource)[0];
		if(Array.isArray(apiRes.results[0].qSource[k])){			
			return apiRes.results[0].qSource[k].join('-');
		}

		return strToFirstUpper(apiRes.results[0].qSource.value);
	}
	return 'No Results';
}

SalesAppController.prototype.getControllerForSearch = function(apiRes){
	if(apiRes.results.length > 1){
		for (var i = 0 ; i < apiRes.results.length; i++){
			if(!apiRes.results[i].aggregations)
				return this.noAggController;
		}
		return this.compareController;
	}
	
	if(apiRes.results[0].aggregations)
		return this.searchController;

	return this.noAggController;
}