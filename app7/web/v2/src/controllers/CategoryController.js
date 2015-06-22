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
	this.renderTimeView(qid);
	this.renderTableView(qid);
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
		var dd = this.getDateDetails(qid);
		var options = {
			width : this.W,
			height : 0.25 * this.H,
			startDate : dd.startDate,
			endDate : dd.endDate,
			dateDist : dd.dist
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
		h : 0.35 * this.H,
		resultsCount : this.qIdResults[qid].results[0].hits.total
	}
	var timeView = new SalesTimeView();
	timeView.render(timeModel[0], options);
}

CategoryController.prototype.renderTableView = function(qid){
	var tableModel = this.tableModels[qid];
	var options = {
		xOrg : 90,
		yOrg : 0.9 * this.H,
		w : this.W,
		h : 0.55 * this.H
	}
	var tableView = new SalesTableView();
	tableView.render(tableModel, options);
}

CategoryController.prototype.getDateDetails = function(qid){
	var results = this.qIdResults[qid];
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






