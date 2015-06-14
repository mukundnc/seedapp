function SalesTableView(){

}

SalesTableView.prototype.render = function(model, options){
	this.model = model;
	this.options = options;
	this.meta = model.meta;
console.log(model);
	
	var g = this.addTableGroup();
	model.columns.forEach((function(col){		
		this.addRectLabel(g, col.x, col.y, col.w, col.h, col.name, 'col-group', 'col-rect', 'col-text')
	}).bind(this));
	this.selectDefaultColumn();
	this.addColumnEventHandlers();
	this.showRowsForCurrentSelection();
}

SalesTableView.prototype.addTableGroup = function(){
	var transform = 'translate(' + this.options.frmStartX  + ',' + this.options.frmStartY + ') scale(1, -1)';
	var css = 'sales-table-group';	
	var g = d3.selectAll('.svg-view')
			  .append('g')
			  .attr({
			  	transform : transform,
			  	class : css
			  });
	
	return g;
}

SalesTableView.prototype.addRectLabel = function(g, x, y, w, h, text, cssGroup, cssRect, cssText, textAlign){
	var gLabel = g.append('g').attr('class', cssGroup);
	var r = gLabel.append('rect')
			 .attr({
			 	x : x,
			 	y : y,
			 	height : h,
			 	width : w,
			 	class : cssRect || 'col-rect'
			 });
			 this.addText(gLabel, x+w/4, -(y+h/2-3), text, cssText, 'center');
	return gLabel;
}

SalesTableView.prototype.addText = function(g, x, y, text, cssText, textAlign){
	var t = g.append('g')
			 .attr('transform', 'scale(1, -1)')
			 .append('text')
			 .attr({
			 	x : x,
			 	y : y,
			 	class : cssText || 'col-text',
			 	'text-anchor' : textAlign || 'middle'
			 })
			 .text(text);
	return t;	
}

SalesTableView.prototype.selectDefaultColumn = function(){
	d3.select('.col-rect').classed('col-select', true);
	d3.select('.col-text').classed('col-text-select', true);
}

SalesTableView.prototype.addColumnEventHandlers = function(){
	var self = this;
	$('.col-group').on('click', function(e){
		self.onColumnChange(this);
	})
}

SalesTableView.prototype.onColumnChange = function(selColElem){
	d3.selectAll('.col-select').classed('col-select', false).classed('col-rect', true);
	d3.selectAll('.col-text-select').classed('col-text-select', false).classed('col-text', true);
	d3.select(selColElem).select('rect').attr('class', 'col-select');
	d3.select(selColElem).select('text').attr('class', 'col-text-select');
	this.showRowsForCurrentSelection();
}

SalesTableView.prototype.showRowsForCurrentSelection = function(){
	var selCol = d3.select('.col-text-select').text();
	var selColRows = _.where(this.model.columns, {name : selCol})[0];
	var g = this.getRowGroup();
	g.html('');

	selColRows.rows.forEach((function(r){
		this.addRectLabel(g, r.x, r.y, r.w, r.h, r.name, 'row-group', 'row-rect', 'row-text', 'center')
	}).bind(this));
	this.selectDefaultRow();
	this.addRowEventHandlers();
}

SalesTableView.prototype.getRowGroup = function(){
	var g = d3.select('.sales-row-group');
	if(g.empty()) {
		g = d3.select('.sales-table-group')
		      .append('g')
		      .attr('class', 'sales-row-group');
	}
	return g;
}

SalesTableView.prototype.selectDefaultRow = function(){
	this.getLastElemnentInD3Sel(d3.selectAll('.row-rect')).classed('row-select', true);
	this.getLastElemnentInD3Sel(d3.selectAll('.row-text')).classed('row-text-select', true);
	this.showSalesChartForCurrentSelection();
}

SalesTableView.prototype.addRowEventHandlers = function(){
	var self = this;
	$('.row-group').on('click', function(e){
		self.onRowChange(this);
	})
}

SalesTableView.prototype.onRowChange = function(selRowElem){
	d3.selectAll('.row-select').classed('row-select', false).classed('row-rect', true);
	d3.selectAll('.row-text-select').classed('row-text-select', false).classed('row-text', true);
	d3.select(selRowElem).select('rect').attr('class', 'row-select');
	d3.select(selRowElem).select('text').attr('class', 'row-text-select');
	this.showSalesChartForCurrentSelection();
}

SalesTableView.prototype.getLastElemnentInD3Sel = function(d3Sel){
	if(d3Sel.empty()) return null;

	var cnt = d3Sel[0].length;
	return d3.select(d3Sel[0][cnt-1]);
}

SalesTableView.prototype.showSalesChartForCurrentSelection = function(){
	var selColName =  d3.select('.col-text-select').text();
	var selRowName = d3.select('.row-text-select').text();
	var selCol = _.where(this.model.columns, {name : selColName})[0];
	var selRow = _.where(selCol.rows, {name : selRowName})[0];
	var g = this.getTableChartGroup();
	g.html('');
	var n = selRow.cells.length;
	var xStart = selRow.cells[0].x;
	var yStart = selRow.cells[0].y;
	var H = 280;
	var W = 700;
	var xMax = xStart + W;
	var yMax = yStart + H;
	var xStartAxis = xStart;
	this.drawAxes(g, xStart, yStart, xMax, yMax);
	var allHeights = [];
	var i = 1;
	selRow.cells.forEach((function(c){
		this.addCellRect(g, xStart, c.y, W/n, 0, 'cell-rect-'+i);
		allHeights.push(c.h)
		xStart += W/n;
		this.addCellLabel(g, xStart, c.y, c.name, W/n, 'cell-text');
		i++;
	}).bind(this));
	this.addYAxisLabels(g, xStartAxis, xMax, H, this.meta.yScaleMap[selRowName]);
	this.animateCategoryHeights(g, allHeights);
}

SalesTableView.prototype.animateCategoryHeights = function(g, heights){
	g.selectAll('rect')
	 .data(heights)
	 .transition()
	 .attr('height', function(h) { return h; })
}

SalesTableView.prototype.getTableChartGroup = function(){
	var g = d3.select('.sales-tbchart-group');
	if(g.empty()){
		g = d3.select('.sales-table-group')
			  .append('g')
			  .attr('class', 'sales-tbchart-group');
	}
	return g;
}

SalesTableView.prototype.drawAxes = function(g, xStart, yStart, xMax, yMax){
	g.append('line')
	 .attr({
	 	x1 : xStart,
	 	y1 : yStart,
	 	x2 : xMax,
	 	y2 : yStart,
	 	class : 'chart-axis'
	 });
	g.append('line')
	 .attr({
	 	x1 : xStart,
	 	y1 : yStart,
	 	x2 : xStart,
	 	y2 : yMax,
	 	class : 'chart-axis'
	 });
}

SalesTableView.prototype.addCellRect = function(g, x, y, w, h, cssRect){
	var r = g.append('rect')
			 .attr({
			 	x : x,
			 	y : y,
			 	width : w,
			 	height : h,
			 	class : cssRect
			 });
	return r;
}

SalesTableView.prototype.addCellLabel = function(g, x, y, text, barWidth, cssText){
	if(this.options.viewType === 'category'){
		var xT = x - barWidth/2;
		var yT = -10;
		this.addText(g, xT, yT, text, cssText, 'middle');
	}
	else{
		var xT = x - 15;
		var yT = -10;
		var t = this.addText(g, xT, yT, text, cssText, 'end');
		t.attr('transform', 'rotate(-30, ' + xT + ',' + yT + ') scale(1, 1) ');
	}
}

SalesTableView.prototype.addYAxisLabels = function(g, xStart, w, h, yScale){
	// this.addLine(g, xStart, h/4, w, h/4);
	// this.addLine(g, xStart, h/2, w, h/2);
	// this.addLine(g, xStart, 3*h/4, w, 3*h/4);
	// this.addLine(g, xStart, h, w, h);

	var max = yScale.domain()[1];
	var xc = xStart-10;
	this.addText(g, xc, -h/4, Math.round(max/4), null, 'end');
	this.addText(g, xc, -h/2, Math.round(max/2), null, 'end');
	this.addText(g, xc, -3*h/4, Math.round(3*max/4), null, 'end');
	this.addText(g, xc, -h, Math.round(max), null, 'end');

	var y = (-h/2.5);
	g.append('text')
	 .attr('transform', 'scale(1,-1) rotate(-180, -50, ' + y + ')')
	 .attr({
	 	x : -230,
	 	y : y+20,
	 	style : 'writing-mode: tb; glyph-orientation-vertical: 90;color:grey;cursor:default;font-size:15px;fill:grey;'
	 })
	 .text('SALES');
}

SalesTableView.prototype.addLine = function(g, px1, py1, px2, py2, s){
	g.append('line')
	 .attr({
		x1 : px1 || 0,
		y1 : py1 || 0,
		x2 : px2 || 0,
		y2 : py2 || 0,
		style : s || 'stroke-width : 1px; stroke : grey;'
	});
}

