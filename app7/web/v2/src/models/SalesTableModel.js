function SalesTableModel(){

}
SalesTableModel.prototype.init = function(options){
	this.options = options;
	this.rowW = 80;
	this.rowH = 25;
	this.colH = 25;
	this.colW = 105;
	this.cellW = 50;
	this.colOffset = 100;
	this.cellStartX = this.xOrg + this.rowW + 100;
	this.cellStartY = 20;
	this.meta = {};
}

SalesTableModel.prototype.getModel = function(uiObject, options){
	this.init(options);
	var tables = [];
	Object.keys(uiObject).forEach((function(tableKey){
		var table = this.getTable(uiObject[tableKey]);
		tables.push(table);
	}).bind(this));
	return tables
}



SalesTableModel.prototype.getTable = function(uiTableObj){
	var columns = [];
	var cX = this.rowW + this.colOffset;
	var cY = this.options.height - this.colH - 10;
	this.meta[uiTableObj.key] = { yScaleMap : {}};
	uiTableObj.items.forEach((function(item){		
		this.getColumn(item, cX, cY, uiTableObj.key);
		cX += this.colW;
	}).bind(this));

	return {
		tableTitle : uiTableObj.key,
		columns : columns
	}
}

SalesTableModel.prototype.getColumn = function(uiColObj, xStart, yStart, tableKey){
	return {
		key : uiColObj.key,
		x : xStart,
		y : yStart,
		h : this.colH,
		w : this.colW,
		rows : this.getRowsForColumn(uiColObj, xStart, yStart, tableKey)
	}
}

SalesTableModel.prototype.getRowsForColumn = function(uiColObj, xStart, yStart, tableKey){
	var rowKey = this.getRowKeyForColumn(colJson);
	var uiRows = uiColObj.items[rowKey];
	var rows = [];
	var rX = this.rowStartX;
	var rY = this.rowStartY;

	uiRows.forEach((function(b){
		rows.push({
			x : rX,
			y : rY,
			w : this.rowW,
			h : this.rowH,
			key : b.key,
			cells : this.getCellsForRow(b, rowKey, tableKey)
		});
		rY += this.rowH;
	}).bind(this));

	return rows;
}

SalesTableModel.prototype.getSalesCellsForRow = function(uiRowObj, rowKey, tableKey){
	var cX = this.cellStartX;
	var cY = this.cellStartY;
	var uiCells = uiRowObj.items;
	var cells = [];

	this.setYscaleForRow(uiCells, tableKey, uiCells.key);
	
	uiCells.forEach((function(b){
		cells.push({
			key : b.key,
			count : b.doc_count,
			x : cX,
			y : cY,
			w : this.cellW,
			h : this.meta[tableKey].yScaleMap[uiCells.key](b.doc_count)
		});
		cX += this.cellW;
	}).bind(this));

	return cells;
}

SalesTableModel.prototype.getRowKeyForColumn = function(uiColObj){
	var timeKeys = ['yearly', 'monthly', 'daily'];
	for(var key in uiColObj){
		var rObj = uiColObj[key];
		if(timeKeys.indexOf(rObj.key) === -1)
			return key;
	}
}

SalesTableModel.prototype.setYscaleForRow = function(uiCellObj, tableKey, rowKey){
	var allVals = [];
	uiCellObj.forEach(function(c){
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

	this.meta[tableKey].yScaleMap[rowKey] = yScale;
}
