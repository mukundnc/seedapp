function OutlierController(appController){
	this.appController = appController;
}

OutlierController.prototype.renderView = function(qid, apiRes){
	console.log(apiRes);
}