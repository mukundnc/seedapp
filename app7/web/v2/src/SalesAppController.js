function SalesAppController(){
	this.apiResp = null;
	this.catSalesInTime = null;
	this.rgnSalesInTine = null;
	this.salesTimeView = null;
	
	this.H = $('.svg-container').height();
	this.W = $('.svg-container').width();
	this.options = {
		frmStartX : 0,
		frmStartY : 0,
		frmWidth : this.W,
		frmHeight : this.H/4,
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

SalesAppController.prototype.showSalesInTimeView = function(model){
	this.options.frmStartX = 0.06 * this.W;
	this.options.frmStartY = 0.30 * this.H;
	if(!this.salesTimeView)
		this.salesTimeView = new SalesTimeView();
	this.salesTimeView.renderCategorySalesInTime(model, this.options);	
}

