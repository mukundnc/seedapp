function SalesAppController(){
		this.init();
}

SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	var options = {
		frmStartX : 0,
		frmStartY : 0,
		frmWidth : $('.svg-container').width(),
		frmHeight : $('.svg-container').height()/3
	};
	var salesTimeModel = new SalesTimeModel(options);
	var catSalesInTime = salesTimeModel.getCategorySalesInTime(resp.results.aggregations.categories.buckets);

	options.frmStartX = 30;
	options.frmStartY = 225;
	var salesTimeView = new SalesTimeView();
	salesTimeView.renderCategorySalesInTime(catSalesInTime, options);
}
