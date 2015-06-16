function CategoryController(appController){
	this.appController = appController;
	this.qIdResults = {};
}

CategoryController.prototype.renderView = function(qid, results){
	if(results && !this.qIdResults[qid])
		this.qIdResults[qid] = results;

	var resParser = new ResponseParser();
	resParser.parse(this.qIdResults[qid])
}