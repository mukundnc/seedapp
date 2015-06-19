function CategoryController(appController){
	this.appController = appController;
	this.qIdResults = {};
	this.tableModels = {};
	this.timeModels = {};
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
}

CategoryController.prototype.renderView = function(qid, results){
	if(results && !this.qIdResults[qid])
		this.qIdResults[qid] = results;

	var resParser = new ResponseParser();
	var uiObject = resParser.parse(this.qIdResults[qid]);

	this.initModels(qid, uiObject);
	this.renderTableView(qid);
	this.renderTimeView(qid);
}

CategoryController.prototype.initModels = function(qid, uiObject){	
	if(!this.tableModels[qid]){
		var options = {
			width : this.W,
			height : 0.5 * this.H
		};
		var tableModel = new SalesTableModel();
		this.tableModels[qid] = tableModel.getModel(uiObject, options);
	}

	if(!this.timeModels[qid]){
		var options = {
			width : this.W,
			height : 0.25 * this.H
		};
		var timeModel = new SalesTimeModel();
		this.timeModels[qid] = timeModel.getModel(uiObject, options);
	}
}

CategoryController.prototype.renderTimeView = function(qid){
	var timeModel = this.timeModels[qid];
	var options = {
		xOrg : 90,
		yOrg : 0.3 * this.H,
		w : this.W,
		h : 0.35 * this.H
	}
	var timeView = new SalesTimeView();
	timeView.render(timeModel, options);
}

CategoryController.prototype.renderTableView = function(qid){

}








