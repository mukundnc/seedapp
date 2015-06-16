function SalesAppController(){
	this.apiResp = null;
	this.homeController = new HomeController(this);
	this.categoryController = new CategoryController(this);
	this.init();
	this.queryIdVsControllerAction = {};
	this.searchTreeView = new SearchTreeView({controller : this});
	this.queryIndex = 1;
	this.queryIndices = {'q0': 'show automobile, electronics, appliances, cloths'};
}


SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	this.resp = resp;
	this.homeController.renderView(resp);
	this.queryIdVsControllerAction['q0'] = this.homeController;
	this.searchTreeView.add({id : 'q0', name : 'home'});
}

SalesAppController.prototype.showQueryView = function(query){
	var qid = this.getQueryId(query);
	var controllerAction = this.getControllerActionForQueryId(qid);
	if(controllerAction)
		controllerAction(qid);
	else
		this.executeQuery(query, qid);
}

SalesAppController.prototype.getQueryId = function(query){
	var qid = this.queryIndices[query];
	if(!qid){
		qid = 'q' + this.queryIndex;
		this.queryIndex++;
		this.queryIndices[qid] = query;
	}
	return qid;
}

SalesAppController.prototype.getControllerActionForQueryId = function(qid){
	return this.queryIdVsControllerAction[qid];
}

SalesAppController.prototype.executeQuery = function(query, qid){
	$('#tbSearch').val(query);
	$.getJSON('/api/search?q=' + query, this.onQueryResponse.bind(this, qid));
}

SalesAppController.prototype.onQueryResponse = function(qid, result){
	if(!result.success){
		console.error(result.message);
		return
	}
	var treeText = '';
	switch(result.query.searchContext){
		case 1 :
			treeText = result.query.query.category[0];
		case 2 : 
		case 3 : 
		case 4 :
			this.queryIdVsControllerAction[qid] = this.categoryController;
			this.categoryController.renderView(qid, result);
			this.searchTreeView.add({id : qid, name : treeText});
			break;
	}
}

SalesAppController.prototype.onSearchNodeSelectionChange = function(qid){
	$('#tbSearch').val(this.queryIndices[qid]);
	this.queryIdVsControllerAction[qid].renderView(qid);
}

