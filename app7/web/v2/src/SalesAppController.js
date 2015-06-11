function SalesAppController(){
		this.init();
}

SalesAppController.prototype.init = function(){
	$.getJSON('/api', (this.onApiResponse).bind(this));
}

SalesAppController.prototype.onApiResponse = function(resp){
	var H = $('.svg-container').height();
	var W = $('.svg-container').width();

	var options = {
		frmStartX : 0,
		frmStartY : 0,
		frmWidth : W,
		frmHeight : H/4
	};
	var salesTimeModel = new SalesTimeModel(options);
	var catSalesInTime = salesTimeModel.getCategorySalesInTime(resp.results.aggregations.categories.buckets);

	options.frmStartX = 0.06 * W;
	options.frmStartY = 0.30 * H;
	var salesTimeView = new SalesTimeView();
	salesTimeView.renderCategorySalesInTime(catSalesInTime, options);
	
	var rgnSalesInTime = salesTimeModel.getCategorySalesInTime(resp.results.aggregations.regions.buckets);
	options.frmStartX = 0.06 * W;
	options.frmStartY = 0.70 * H;
	var salesTimeView = new SalesTimeView();
	salesTimeView.renderCategorySalesInTime(rgnSalesInTime, options);
}
