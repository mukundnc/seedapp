function SalesAppController(){
	this.apiResp = null;
	this.homeController = new HomeController(this);
	this.init();
	this.mapSearchNodeVsControllerAction = {};
	this.searchTreeView = new SearchTreeView({controller : this});
}


SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	this.resp = resp;
	this.homeController.renderHome(resp);
	this.mapSearchNodeVsControllerAction['home'] = this.homeController.renderHome;
	this.searchTreeView.add({id : 'home1', name : 'home'});
	this.searchTreeView.add({id : 'home2', name : 'home'});
	this.searchTreeView.add({id : 'home3', name : 'home'});
}










