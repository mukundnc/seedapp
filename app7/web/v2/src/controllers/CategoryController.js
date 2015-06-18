function CategoryController(appController){
	this.appController = appController;
	this.qIdResults = {};
}

CategoryController.prototype.renderView = function(qid, results){
	if(results && !this.qIdResults[qid])
		this.qIdResults[qid] = results;

	var resParser = new ResponseParser();
	var uiObject = resParser.parse(this.qIdResults[qid]);

	H = $('.svg-container').height();
	W = $('.svg-container').width();
	var options = {
		width : W,
		height : 0.5 * H
	};

	var tableModel = new SalesTableModel();
	var salesTableModel = tableModel.getModel(uiObject, options);

	options = {
		width : W,
		height : 0.25 * H
	};

	var timeModel = new SalesTimeModel();
	var salesTimeModel = timeModel.getModel(uiObject, options);
}