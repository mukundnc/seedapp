function SalesTableModel(options){
	this.options = options;
	this.rowW = 80;
	this.rowH = 25;
	this.colH = 25;
	this.colW = 105;
	this.cellW = 50;
	this.colOffset = 100;
	this.rowStartX = 0;
	this.rowStartY = 200;
	this.cellStartX = this.rowStartX + this.rowW + 100;
	this.cellStartY = 20;
	this.meta = {yScaleMap : {}};
}

SalesTableModel.prototype.getTableModel = function(allColsWithRowAsJson){
	var cols = Object.keys(allColsWithRowAsJson);
	var columns = [];

	var cX = this.rowW + this.colOffset;
	var cY = this.options.frmHeight - this.colH - 10;

	cols.forEach((function(c){
		
		columns.push(this.getSalesColumn(allColsWithRowAsJson[c], cX, cY));
		
		cX += this.colW;
	
	}).bind(this));

	return {
		columns : columns,
		meta : this.meta
	}
}

SalesTableModel.prototype.getSalesColumn = function(colJson, xStart, yStart){
	return {
		name : colJson.key,
		x : xStart,
		y : yStart,
		h : this.colH,
		w : this.colW,
		rows : this.getSalesRowsForColumn(colJson, xStart, yStart)
	}
}

SalesTableModel.prototype.getRowKeyForColumn = function(colJson){
	var rowKey = '';
	switch(colJson.key){
		case 'Clothing':
		case 'Electronics':
		case 'Automobile':
		case 'Appliance':
			rowKey = 'types';
			break;
		case 'North':
		case 'South':
		case 'East':
		case 'West':
			rowKey = 'states';
			break;
	}
	return rowKey;
}

SalesTableModel.prototype.getCellKeyForRow = function(rowKey){
	var cellKey = '';
	switch(rowKey){
		case 'types':
			cellKey = 'brands';
			break;
		case 'states':
			cellKey = 'cities';
			break;
	}
	return cellKey;	
}

SalesTableModel.prototype.getSalesRowsForColumn = function(colJson, xStart, yStart){
	var rowKey = this.getRowKeyForColumn(colJson);
	var buckets = colJson[rowKey].buckets;
	var rows = [];
	var rX = this.rowStartX;
	var rY = this.rowStartY;

	buckets.forEach((function(b){
		rows.push({
			x : rX,
			y : rY,
			w : this.rowW,
			h : this.rowH,
			name : b.key,
			cells : this.getSalesCellsForRow(b, rowKey)
		});
		rY += this.rowH;
	}).bind(this));

	return rows;
}

SalesTableModel.prototype.getSalesCellsForRow = function(cellsJson, rowKey){
	var cX = this.cellStartX;
	var cY = this.cellStartY;
	var cellKey = this.getCellKeyForRow(rowKey);
	var buckets = cellsJson[cellKey].buckets;
	var cells = [];

	this.setYscaleForRow(buckets, cellsJson.key);
	
	buckets.forEach((function(b){
		cells.push({
			name : b.key,
			count : b.doc_count,
			x : cX,
			y : cY,
			w : this.cellW,
			h : this.meta.yScaleMap[cellsJson.key](b.doc_count)
		});
		cX += this.cellW;
	}).bind(this));

	return cells;
}

SalesTableModel.prototype.setYscaleForRow = function(cells, rowKey){
	var allVals = [];
	cells.forEach(function(c){
		allVals.push(c.doc_count)
	});
	var dS = d3.min(allVals, function(v) {
				return v;
			 });
	var dE = d3.max(allVals, function(v) {
				return v;
			 });

	var rS = this.cellStartY;
	var rE = this.options.frmHeight - this.colH - 50;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);

	this.meta.yScaleMap[rowKey] = yScale;
}




