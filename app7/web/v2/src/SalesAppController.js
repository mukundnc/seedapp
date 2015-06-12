function SalesAppController(){
	this.apiResp = null;
	this.catSalesInTime = null;
	this.rgnSalesInTine = null;
	this.salesTimeView = null;

	this.catSalesTableModel = null;
	this.rgnSalesTableModel = null;
	this.salesTableView = null;
	
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
	this.options = {
		frmStartX : 0,
		frmStartY : 0,
		frmWidth : this.W,
		frmHeight : 0.25 * this.H,
		controller : this,
		viewType : 'category'		
	};

	this.init();
}


SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	this.resp = resp;
	var salesTimeModel = new SalesTimeModel(this.options);
	this.catSalesInTime = salesTimeModel.getCategorySalesInTime(this.resp.results.aggregations.categories.buckets);	
	this.rgnSalesInTime = salesTimeModel.getCategorySalesInTime(this.resp.results.aggregations.regions.buckets);
	this.showSalesInTimeView(this.catSalesInTime);

	this.options.frmHeight = 0.55 * this.H;
	var salesTableModel = new SalesTableModel(this.options);
	this.catSalesTableModel = salesTableModel.getTableModel(this.resp.results.aggregations.categories.buckets);
	this.rgnSalesTableModel = salesTableModel.getTableModel(this.resp.results.aggregations.regions.buckets);
	this.showSalesTableView(this.catSalesTableModel);
}

SalesAppController.prototype.showSalesInTimeView = function(model){
	this.options.frmStartX = 0.06 * this.W;
	this.options.frmStartY = 0.30 * this.H;
	if(!this.salesTimeView)
		this.salesTimeView = new SalesTimeView();
	this.salesTimeView.render(model, this.options);	
}

SalesAppController.prototype.showSalesTableView = function(model){	
	this.options.frmStartX = 0.06 * this.W;
	this.options.frmStartY = 0.95 * this.H;
	if(!this.salesTableView)
		this.salesTableView = new SalesTableView();
	this.salesTableView.render(model, this.options);	
}

SalesAppController.prototype.activeViewChange = function(active){
	this.salesTimeView.clear();
	this.options.viewType = active;
	switch(active){
		case 'category' : 
			this.showSalesInTimeView(this.catSalesInTime);
			break;
		case 'region' : 
			this.showSalesInTimeView(this.rgnSalesInTime);
			break;
	}
}


