function OutlierController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.qidModels = {};
	var vp = getViewPort();
	this.H = vp.height;
	this.W = vp.width;
}

OutlierController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;	
	
	var results = this.qidResults[qid];
	
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
	var qParams = {
		type : line === 'product' ? 'line' : 'country',
		label : selLabel
	}
	var bkup = this.qidResults[qid].query.time.isPresent;
	this.qidResults[qid].query.time.isPresent = false;
	var query = getQueryString(qParams, this.qidResults[qid].query);
	this.qidResults[qid].query.time.isPresent = bkup;
	query += ' in last 1 year';
	$('#tbSearch').val(query);
	this.appController.executeQuery();
}	

