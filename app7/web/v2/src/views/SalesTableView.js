function SalesTableView(){
	this.utils = new SvgUtils();
	this.groups = {
		table : 'sales-table-group'
	};
	this.viewTypeEventAdded = false;
	this.levels = 0;
}

SalesTableView.prototype.init = function(model, options){
console.log(model);
	this.model = model;
	this.options = options;
	var g = this.getGroupById(this.groups.table);
	g.html('');
	if(!this.viewTypeEventAdded){
		$('.st-choices').on('click', this.render.bind(this, this.model, this.options));
		this.viewTypeEventAdded = true;
	}
}

SalesTableView.prototype.render = function(model, options){
	this.init(model, options);
	var tObj = this.getTableObjForCurrentViewType();
	this.levels = tObj.levels;
	switch(tObj.levels){
		case 3 : this.renderTable3l(tObj); break;
		case 2 : this.renderTable2l(tObj); break;
		case 1 : this.renderTable1l(tObj); break;
	}
}

SalesTableView.prototype.getGroupById = function(clsName){
	var g = d3.select('.svg-container').select('.svg-view').select('.' + clsName);
	if(g.empty()){
		g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('transform', 'translate(' + this.options.xOrg + ',' + this.options.yOrg + ') scale(1, -1)')
		      .attr('class', clsName);
	}
	return g;
}

SalesTableView.prototype.getTableObjForCurrentViewType = function(){
	var selTitle = d3.selectAll('.st-text-select').text().toLowerCase();
	var tblObj = _.where(this.model, {tableTitle : selTitle})[0];
	return tblObj;
}

SalesTableView.prototype.renderTable3l = function(tblObj){
	this.addColumns(tblObj);
	this.addRowsForCurrentSelection();
}

SalesTableView.prototype.renderTable2l = function(tblObj){
	
}

SalesTableView.prototype.renderTable1l = function(tblObj){
	
}

SalesTableView.prototype.addColumns = function(tblObj){
	var g = this.getGroupById(this.groups.table);
	tblObj.columns.forEach((function(col){
		var gR = this.utils.addRectLabel(g, col.x, col.y, col.w, col.h, col.key, 'col-group', 'col-rect', 'col-text', 'middle');
		var t = gR.select('text');
		t.attr('x', col.x + col.w/2);
	}).bind(this));
	g.select('.col-rect').classed('col-select', true);
	g.select('.col-text').classed('col-text-select', true);
	var self = this;
	$('.col-group').on('click', function(e){
		self.onColumnChange(this);
	})
}

SalesTableView.prototype.onColumnChange = function(selColElem){
	var g = this.getGroupById(this.groups.tables);
	d3.selectAll('.col-select').classed('col-select', false).classed('col-rect', true);
	d3.selectAll('.col-text-select').classed('col-text-select', false).classed('col-text', true);
	d3.select(selColElem).select('rect').attr('class', 'col-select');
	d3.select(selColElem).select('text').attr('class', 'col-text-select');
	switch(this.levels){
		case 3 : this.onColumnChange3l(selColElem); break;
		case 2 : this.onColumnChange2l(selColElem); break;
	}
}

SalesTableView.prototype.onColumnChange3l = function(selColElem){
	this.addRowsForCurrentSelection();
}

SalesTableView.prototype.onColumnChange2l = function(selColElem){
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

SalesTableView.prototype.addRowsForCurrentSelection = function(){
	var tblObj = this.getTableObjForCurrentViewType();
	var selCol = d3.select('.col-text-select').text();
	var selColRows = _.where(tblObj.columns, {key : selCol})[0];
	var g = this.getRowGroup();
	g.html('');

	selColRows.rows.forEach((function(r){
		this.utils.addRectLabel(g, r.x, r.y, r.w, r.h, r.key, 'row-group', 'row-rect', 'row-text', 'center')
	}).bind(this));
	this.selectDefaultRow();
	this.addRowEventHandlers();
}

SalesTableView.prototype.selectDefaultRow = function(){
	this.getLastElemnentInD3Sel(d3.selectAll('.row-rect')).classed('row-select', true);
	this.getLastElemnentInD3Sel(d3.selectAll('.row-text')).classed('row-text-select', true);
	this.showSalesChartForCurrentSelection3l();
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
	this.showSalesChartForCurrentSelection3l();
}

SalesTableView.prototype.getLastElemnentInD3Sel = function(d3Sel){
	if(d3Sel.empty()) return null;

	var cnt = d3Sel[0].length;
	return d3.select(d3Sel[0][cnt-1]);
}

SalesTableView.prototype.showSalesChartForCurrentSelection3l = function(){
	var tblObj = this.getTableObjForCurrentViewType();
	var selColName =  d3.select('.col-text-select').text();
	var selRowName = d3.select('.row-text-select').text();
	var selCol = _.where(tblObj.columns, {key : selColName})[0];
	var selRow = _.where(selCol.rows, {key : selRowName})[0];
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
		this.utils.addRect(g, xStart, c.y, W/n, 0, 'cell-rect-'+i);
		allHeights.push(c.h)
		xStart += W/n;
		this.addCellLabel(g, xStart, c.y, c.key, W/n, 'cell-text');
		i++;
	}).bind(this));
	this.addYAxisLabels(g, xStartAxis, xMax, H, selRow.yScale);
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
	this.utils.addLine(g, xStart, yStart, xMax, yStart, 'chart-axis');
	this.utils.addLine(g, xStart, yStart, xStart, yMax, 'chart-axis')
}

SalesTableView.prototype.addCellLabel = function(g, x, y, text, barWidth, cssText){
	var tblObj = this.getTableObjForCurrentViewType();
	var productTypes = ['categories', 'types', 'brands', 'models']
	if(productTypes.indexOf(tblObj.tableTitle) !== -1){
		var xT = x - barWidth/2;
		var yT = -6;
		this.utils.addTextXForm(g, xT, yT, text, cssText, 'middle');
	}
	else{
		var xT = x - 10;
		var yT = -10;
		var t = this.utils.addText(g, xT, yT, text, cssText, 'end');
		t.attr('transform', 'rotate(30, ' + xT + ',' + yT + ') scale(1, -1) ');
	}
}

SalesTableView.prototype.addYAxisLabels = function(g, xStart, w, h, yScale){
	var max = yScale.domain()[1];
	var xc = xStart-10;
	this.utils.addTextXForm(g, xc, -h/4, Math.round(max/4), 'st-text', 'end');
	this.utils.addTextXForm(g, xc, -h/2, Math.round(max/2), 'st-text', 'end');
	this.utils.addTextXForm(g, xc, -3*h/4, Math.round(3*max/4), 'st-text', 'end');
	this.utils.addTextXForm(g, xc, -h, Math.round(max), 'st-text', 'end');
	var y = -h/2
	var x = 140;
	var gT = this.utils.addTextXForm(g, x, y, 'SALES', 'col-text', 'middle');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}
