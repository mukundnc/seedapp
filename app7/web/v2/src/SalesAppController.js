function SalesAppController(){
	this.apiResp = null;
	this.homeController = new HomeController(this);
	this.categoryController = new CategoryController(this);
	this.init();
	this.queryIdVsController = {};
	this.searchTreeView = new SearchTreeView({controller : this});
	this.queryIndex = 1;
	this.queryIndices = {'show automobile, electronics, appliances, cloths' : 'q0'};
}


SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
	$('#tbSearch').on('keydown', this.onKeyDown.bind(this));
	$('.search-icon').on('click', this.onSearchClick.bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	this.resp = resp;
	this.homeController.renderView(resp);
	this.queryIdVsController['q0'] = this.homeController;
	this.searchTreeView.add({id : 'q0', name : 'home'});
}

SalesAppController.prototype.showQueryView = function(query){
	var qid = this.getQueryId(query);
	var controller = this.getControllerForQueryId(qid);
	if(controller)
		controller.renderView(qid);
	else
		this.executeQuery(query, qid);
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
			this.queryIdVsController[qid] = this.categoryController;
			this.categoryController.renderView(qid, result);
			this.searchTreeView.add({id : qid, name : treeText});
			break;
	}
}

SalesAppController.prototype.onSearchNodeSelectionChange = function(qid){
	$('#tbSearch').val(this.getQueryById(qid));
	this.showQueryView(this.getQueryById(qid));
}

SalesAppController.prototype.onKeyDown = function(e){
	if(e.keyCode !== 13) return;

	this.showQueryView($('#tbSearch').val());
}

SalesAppController.prototype.onSearchClick = function(){
	this.showQueryView($('#tbSearch').val());
}

SalesAppController.prototype.getQueryById = function(qid){
	for(var query in this.queryIndices){
		if(this.queryIndices[query] === qid)
			return query;
	}
}