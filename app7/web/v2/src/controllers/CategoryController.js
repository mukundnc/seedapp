function CategoryController(appController){
	this.appController = appController;
	this.qIdResults = {};
}

CategoryController.prototype.renderView = function(qid, results){
	if(results && !this.qIdResults[qid])
		this.qIdResults[qid] = results;

	var resParser = new ResponseParser();
	var uiObject = resParser.parse(this.qIdResults[qid]);

	var xOrg = 50;
	var yOrg = 50;
	H = $('.svg-container').height();
	W = $('.svg-container').width();
	var options = {
		width : W,
		height : 0.5 * H
	};

	var modelFactory = new SalesTableModel();
	var salesTableModel = modelFactory.getModel(uiObject, options);
}