function SalesTimeView(){

}

SalesTimeView.prototype.renderCategorySalesInTime = function(catSalesInTime, options){
	var svg = d3.selectAll('svg');

	var g = svg.append('g')
		       .attr('transform', 'translate(' + options.frmStartX + ',' + options.frmStartY + ') scale(1, -1)');

    Object.keys(catSalesInTime).forEach(function(yKey){
    	var catSaleInYear = catSalesInTime[yKey];
    	Object.keys(catSaleInYear).forEach(function(cKey){
    		var c = catSaleInYear[cKey];
    		g.append('rect')
			 .attr({
			 	x : c.x,
			 	y : c.y,
			 	width : c.W,
			 	height : c.H,
			 	style : "stroke-width : 1px; stroke : white; fill: none"
			 });
    	});
    });
}