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

	options.frmStartX = 20;
	options.frmStartY = 250;
	var salesTimeView = new SalesTimeView();
	salesTimeView.renderCategorySalesInTime(catSalesInTime, options);
return;

	var svg = d3.selectAll('svg');

	var g = svg.append('g')
		       .attr('transform', 'translate(50, 250) scale(1, -1)');

	
	var yearlySales = resp.results.aggregations.yearly.buckets;
	var min = d3.min(yearlySales, function(y){
		return y.doc_count;
	});
	var max = d3.max(yearlySales, function(y){
		return y.doc_count;
	});
	var xScale = d3.scale.linear()
						  .domain([2000, 2014])
						  .range([0, 400]);
	var yScale = d3.scale.linear()
						  .domain([min, max])
						  .range([30, 200]);
	var dataset = [];
	var dStart = 0;
	var w = 60;
	yearlySales.forEach(function(y){
		dataset.push([dStart, yScale(y.doc_count)]);
		dStart+=w;
	});
	g.selectAll('rect')
	 .data(dataset)
	 .enter()
	 .append('rect')
	 .attr({
	 	x : function(d) { return d[0]; },
	 	y : 30,
	 	width : w,
	 	height : function(d) { return d[1]; },
	 	style : "stroke-width : 1px; stroke : white; fill: none"
	 });
}
