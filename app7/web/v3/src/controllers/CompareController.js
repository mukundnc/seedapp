function CompareController(appController){
	this.appController = appController;
	this.qidResults = {};
}

CompareController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;

	var results = this.qidResults[qid];

	console.log('m here');
}