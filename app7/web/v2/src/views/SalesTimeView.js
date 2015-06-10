function SalesTimeView(){

}

SalesTimeView.prototype.renderCategorySalesInTime = function(catSalesInTime, options){
	var yBlockWd = catSalesInTime.meta.yearBlockWidth;
	var svg = d3.selectAll('svg');

	var g = svg.append('g')
		       .attr('transform', 'translate(' + options.frmStartX + ',' + options.frmStartY + ') scale(1, -1)');
    var xEnd = 0;	       
    Object.keys(catSalesInTime.data).forEach((function(yKey){

    	var catSaleInYear = catSalesInTime.data[yKey];

    	Object.keys(catSaleInYear).forEach((function(cKey){

    		 var c = catSaleInYear[cKey];

			 this.addRect(g, c.x, c.y, c.W, c.H, cKey);									//category rect

			 xEnd = c.x + c.W;

    	}).bind(this));

    	this.addLine(g, xEnd, 0, xEnd, -6);              								// x axis ticks

    	this.addText(g, (xEnd-yBlockWd/2), 15, yKey);    								// year labels

    }).bind(this));

    this.addLine(g, 0, 0, xEnd, 0);                      								// x axis
    this.addLine(g, 0, 0, 0, options.frmHeight);	     								// y axis
    this.addYAxisLabels(g, xEnd, options.frmHeight, catSalesInTime.meta.yScale);		// y axis labels
}

SalesTimeView.prototype.getFillStyleForCategory = function(category){
	var style = '';
	switch(category){
		case 'Automobile' : style = 'stroke-width : 1px; stroke : white; fill: #2b908f'; break;
		case 'Electronics' : style = 'stroke-width : 1px; stroke : white; fill: #90ee7e'; break;
		case 'Applicance' : style = 'stroke-width : 1px; stroke : white; fill: #f45b5b'; break;
		case 'Clothing' : style = 'stroke-width : 1px; stroke : white; fill: #7798BF'; break;
	}
	return style;
}
SalesTimeView.prototype.addRect = function(g, x, y, w, h, category){
	g.append('rect')
	 .attr({
	 	x : x,
	 	y : y,
	 	width : w,
	 	height : h,
	 	style : this.getFillStyleForCategory(category)
	 });
}
SalesTimeView.prototype.addLine = function(g, px1, py1, px2, py2, s){
	g.append('line')
	 .attr({
		x1 : px1 || 0,
		y1 : py1 || 0,
		x2 : px2 || 0,
		y2 : py2 || 0,
		style : s || 'stroke-width : 1px; stroke : grey;'
	});
}

SalesTimeView.prototype.addText = function(g, x, y, label, textAnchor){
	g.append('g')
	 .attr('transform', 'scale(1,-1)')
	 .append('text')
	 .attr({
	 	x : x || 0,
	 	y : y || 0,
	 	'text-anchor' : textAnchor | 'middle',
	 	style:'color:grey;cursor:default;font-size:11px;fill:grey;'
	 })
	 .text(label);
}

SalesTimeView.prototype.addYAxisLabels = function(g, w, h, yScale){
	this.addLine(g, 0, h/4, w, h/4);
	this.addLine(g, 0, h/2, w, h/2);
	this.addLine(g, 0, 3*h/4, w, 3*h/4);
	this.addLine(g, 0, h, w, h);

	var max = yScale.domain()[1];
	this.addText(g, -25, -h/4, Math.round(yScale(max/4)), null, 'end');
	this.addText(g, -25, -h/2, Math.round(yScale(max/2)), null, 'end');
	this.addText(g, -25, -3*h/4, Math.round(yScale(3*max/4)), null, 'end');
	this.addText(g, -25, -h, Math.round(yScale(max)), null, 'end');
}

