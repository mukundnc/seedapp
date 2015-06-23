function SearchController(appController){
	this.appController = appController;
	this.qIdFrameModels = {};
	this.modelFactory = new ModelFactory();
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();}

SearchController.prototype.renderView = function(qid, apiRes){
	if(!this.qIdFrameModels[qid] && apiRes)
		this.qIdFrameModels[qid] = this.modelFactory.getFrameModel(apiRes, this.getModelOptions(apiRes));

	var frameModel = this.qIdFrameModels[qid];
	var searchFrameView = new SearchFrameView(frameModel, this.getViewOptions());
	searchFrameView.render()
}

SearchController.prototype.getModelOptions = function(apiRes){
	var dd = this.getDateDetails(apiRes);
	return {
		container : {
			width : this.W - 50,
			height : this.H * 0.25
		},
		timeline : {
			width : this.W - 50,
			height : this.H * 0.5,
			startDate : dd.startDate,
			endDate : dd.endDate,
			dateDist : dd.dist

		}
	};
}

SearchController.prototype.getViewOptions = function(){

}

SearchController.prototype.getDateDetails = function(results){
	if(!results.query.filters){
		return {
			startDate : '2000/01/01',
			endDate : '2014/12/31',
			dist : 'yearly'
		}
	}
	var arr = [];
	var filters = results.query.filters.and.concat(results.query.filters.or);
	filters.forEach(function(f){
		if(f.filter.isDate){
			arr.push(f.filter.value);
		}
	});

	if(arr.length < 2)
		return {
			startDate : '2000/01/01',
			endDate : '2014/12/31',
			dist : 'yearly'
		}

	var details = {
		startDate : arr[0],
		endDate : arr[1],
		dist : 'yearly'
	};
	var diff = new Date(arr[1]) - new Date (arr[0]);
	var dDays = diff/(1000 * 60 * 60 * 24);

	if(dDays < 61)
		details.dist = 'daily'
	else if(dDays < 366)
		details.dist = 'monthly'

	return details;
}
