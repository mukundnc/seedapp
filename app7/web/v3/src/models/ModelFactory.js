function ModelFactory(){

}

ModelFactory.prototype.getFrameModel = function(apiRes, options){
	var resParser = new ResponseParser();
	var uiObject = resParser.parse(apiRes);

	var tableModeler = new SalesTableModel();
	var tableModel = tableModeler.getModel(uiObject, options.container);

	var timeModeler = new SalesTimeModel();
	var timeModel = timeModeler.getModel(uiObject, options.timeline);

	console.log(tableModel);
	console.log(timeModel);
}