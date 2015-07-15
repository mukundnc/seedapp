function OutlierController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
}

OutlierController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;	
	
	var results = this.qidResults[qid];
	console.log(results);
	
	this.initModel(results, qid);
	var model = this.qidModels[qid];
	
	var outlierView = new OutlierView();
	outlierView.render(model, this.getViewOptions(results, qid));
	
}

OutlierController.prototype.initModel = function(results, qid){
	if(this.qidModels[qid]) return;
	this.qidModels[qid] = new ModelFactory().getOutlierModel(results, this.getModelOptions(results, qid));
}

OutlierController.prototype.getModelOptions = function(results, qid){
	var options = {
		w : this.W - 100,
		h : this.H - 150
	}
	return options;
}

OutlierController.prototype.getViewOptions = function(results, qid){
	var options = {
		w : this.W - 100,
		h : this.H/2 - 150,
		xOrg : 90,
		yOrg : this.H/2
	}
	return options;
}

