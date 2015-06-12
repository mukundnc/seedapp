function SalesTableModel(options){
	this.options = options;
	this.rowW = 50;
	this.rowH = 25;
	this.colH = 25;
	this.colW = 25;
	this.cellW = 50;
	this.meta = {yScaleMap : {}};
}

SalesTableModel.prototype.getTableModel = function(allColsWithRowAsJson){
	var cols = Object.keys(allColsWithRowAsJson);
	var columns = [];

	var cX = this.rowW;
	var cY = this.options.frmHeight - this.colH - 10;

	cols.forEach((function(c){
		
		columns.push(this.getSalesColumn(allColsWithRowAsJson[c], cX, cY));
		
		cX += this.colW;
	
	}).bind(this));

console.log(columns);

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
		case 'Applicance':
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
	var rX = 0;
	var rY = 0;

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
	var cX = this.rowW + 50;
	var cY = this.rowH + 50;
	var cellKey = this.getCellKeyForRow(rowKey);
	var buckets = cellsJson[cellKey].buckets;
	var cells = [];

	this.setYscaleForRow(buckets, rowKey);
	
	buckets.forEach((function(b){
		cells.push({
			name : b.key,
			count : b.doc_count,
			x : cX,
			y : cY,
			w : this.cellW,
			h : this.meta.yScaleMap[rowKey](b.doc_count)
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

	var rS = 0;
	var rE = this.options.frmHeight;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);

	this.meta.yScaleMap[rowKey] = yScale;
}




