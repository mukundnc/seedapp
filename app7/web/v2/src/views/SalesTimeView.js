function SalesTimeView(){

}

SalesTimeView.prototype.renderCategorySalesInTime = function(catSalesInTime, options){
	var yBlockWd = this.yearBlockWidth(catSalesInTime);
	var svg = d3.selectAll('svg');

	var g = svg.append('g')
		       .attr('transform', 'translate(' + options.frmStartX + ',' + options.frmStartY + ') scale(1, -1)');
    var xEnd = 0;	       
    Object.keys(catSalesInTime).forEach((function(yKey){
    	var catSaleInYear = catSalesInTime[yKey];
    	Object.keys(catSaleInYear).forEach((function(cKey){
    		var c = catSaleInYear[cKey];
    		g.append('rect')
			 .attr({
			 	x : c.x,
			 	y : c.y,
			 	width : c.W,
			 	height : c.H,
			 	style : this.getFillStyleForCategory(cKey)
			 });
			 xEnd = c.x + c.W;
    	}).bind(this));
    	this.addLine(g, xEnd, 0, xEnd, -6);          // x axis ticks
    	this.addText(g, (xEnd-yBlockWd/2), 15, yKey);
    }).bind(this));

    this.addLine(g, 0, 0, xEnd, 0);                  // x axis
    this.addLine(g, 0, 0, 0, options.frmHeight);	 // y axis
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

SalesTimeView.prototype.addText = function(g, x, y, label){
	g.append('g')
	 .attr('transform', 'scale(1,-1)')
	 .append('text')
	 .attr({
	 	x : x || 0,
	 	y : y || 0,
	 	'text-anchor' : 'middle',
	 	style:'color:grey;cursor:default;font-size:11px;fill:grey;'
	 })
	 .text(label);
}

SalesTimeView.prototype.yearBlockWidth = function(catSalesInTime){
	var w = 0;
	var y1 = Object.keys(catSalesInTime)[0];
	Object.keys(catSalesInTime[y1]).forEach(function(c){
		w += (2 * catSalesInTime[y1][c].W);
	});
	return w;
}