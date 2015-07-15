function OutlierController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
}

OutlierController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;
	
	console.log(this.qidResults[qid])
	
}

