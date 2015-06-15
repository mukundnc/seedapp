function SalesAppController(){
	this.apiResp = null;
	this.homeController = new HomeController(this);
	this.init();
	this.queryIdVsControllerAction = {};
	this.searchTreeView = new SearchTreeView({controller : this});
	this.queryIndex = 1;
	this.queryIndices = {};
}


SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	this.resp = resp;
	this.homeController.renderHome(resp);
	this.queryIdVsControllerAction['q0'] = this.homeController.renderHome;
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
	}
	return qid;
}

SalesAppController.prototype.getControllerActionForQueryId = function(qid){
	return this.queryIdVsControllerAction[qid];
}

SalesAppController.prototype.executeQuery = function(query, qid){
	$.getJSON('/api/search?q=' + query, this.onQueryResponse.bind(this, qid));
}

SalesAppController.prototype.onQueryResponse = function(qid, result){
	console.log(qid);
	console.log(result);
}


