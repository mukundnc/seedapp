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
		controller : this,
		qid : qid,
		w : this.W - 100,
		h : this.H/2 - 150,
		xOrg : 70,
		yOrg : this.H/2
	}
	return options;
}

OutlierController.prototype.executeOutlierDrilldownSearch = function(selLabel, qid, line){
	var qSource = this.qidResults[qid].qSource;
	var qTarget = this.qidResults[qid].qTarget;
	var qParams = {
		type : line === 'product' ? 'brand' : 'region',
		label : selLabel
	}
	var query = getQueryString(qParams, qSource, qTarget, null);
	query += ' in last 1 year';
	$('#tbSearch').val(query);
	this.appController.executeQuery();
}	

