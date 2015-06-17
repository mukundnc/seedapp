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
	this.rowStartX = 0;
	this.rowStartY = 200;
	this.cellStartX = this.rowStartX + this.rowW + 100;
	this.cellStartY = 20;
	this.cellStartY = 20;
}

SalesTableModel.prototype.getModel = function(uiObjects, options){
	this.init(options);
	var tables = [];
	uiObjects.forEach((function(uiObject){
		Object.keys(uiObject).forEach((function(tableKey){
			if(tableKey === 'key1' || tableKey === 'key2'){
				var table = this.getTable(uiObject[tableKey]);
				tables.push(table);
			}
		}).bind(this));
	}).bind(this));
console.log(tables);	
	return tables;
}

SalesTableModel.prototype.getTable = function(uiTableObj){
	var levels = this.getLevelDepth(uiTableObj);
	switch(levels){
		case 4 : 
		case 3 : return this.getTableFor3Levels(uiTableObj); break;
		case 2 : return this.getTableFor2Levels(uiTableObj); break;
		case 1 : return this.getTableFor1Level1(uiTableObj); break;
	}
}

SalesTableModel.prototype.getLevelDepth = function(uiTableObj){
	var levels = 1;
	var yearKeys = ['yearly', 'monthly', 'daily'];
	var pivot = uiTableObj.items;
	while(pivot.length > 0){
		if(yearKeys.indexOf(pivot[0].key) === -1)
			pivot = pivot[0].items;
		else if(pivot[1] && pivot[1].items && pivot[1].items.length > 0)
			pivot = pivot[1].items;
		else
			break;
		levels++;
	}
	return levels/2;
}

SalesTableModel.prototype.getTableFor3Levels = function(uiTableObj){
	var columns = [];
	var cX = this.rowW + this.colOffset;
	var cY = this.options.height - this.colH - 10;
	uiTableObj.items.forEach((function(item){		
		columns.push(this.getColumn3l(item, cX, cY));
		cX += this.colW;
	}).bind(this));

	return {
		tableTitle : uiTableObj.key,
		columns : columns,
		levels : 3
	}	
}

SalesTableModel.prototype.getColumn3l = function(uiColObj, xStart, yStart){
	return {
		key : uiColObj.key,
		x : xStart,
		y : yStart,
		h : this.colH,
		w : this.colW,
		rows : this.getRowsForColumn3l(uiColObj, xStart, yStart)
	}
}

SalesTableModel.prototype.getRowsForColumn3l = function(uiColObj, xStart, yStart){
	var rowKey = this.getRowKeyForColumn(uiColObj);
	var uiRows = uiColObj.items[rowKey].items;
	var rows = [];
	var rX = this.rowStartX;
	var rY = this.rowStartY;

	uiRows.forEach((function(b){
		var yScale = this.getYscaleForRow(b.items[0].items);
		rows.push({
			x : rX,
			y : rY,
			w : this.rowW,
			h : this.rowH,
			key : b.key,
			yScale : yScale,
			cells : this.getCellsForRow3l(b, yScale )
		});
		rY += this.rowH;
	}).bind(this));

	return rows;
}

SalesTableModel.prototype.getCellsForRow3l = function(uiRowObj, yScale){
	var cX = this.cellStartX;
	var cY = this.cellStartY;
	var uiCells = uiRowObj.items[0].items || uiRowObj.items;
	var cells = [];
	
	uiCells.forEach((function(b){
		cells.push({
			key : b.key,
			count : b.doc_count,
			x : cX,
			y : cY,
			w : this.cellW,
			h : yScale(b.doc_count)
		});
		cX += this.cellW;
	}).bind(this));

	return cells;
}

SalesTableModel.prototype.getRowKeyForColumn = function(uiColObj){
	var timeKeys = ['yearly', 'monthly', 'daily'];
	for(var key in uiColObj.items){
		var rObj = uiColObj.items[key];
		if(timeKeys.indexOf(rObj.key) === -1)
			return key;
	}
}

SalesTableModel.prototype.getYscaleForRow = function(uiCellObj){
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
	var rE = this.options.height - this.colH - 50;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);

	return yScale;
}

SalesTableModel.prototype.getTableFor2Levels = function(uiTableObj){
	var columns = [];
	var cX = this.rowW + this.colOffset;
	var cY = this.options.height - this.colH - 10;
	uiTableObj.items.forEach((function(item){		
		columns.push(this.getColumn2l(item, cX, cY));
		cX += this.colW;
	}).bind(this));

	return {
		tableTitle : uiTableObj.key,
		columns : columns,
		levels : 2
	}	
}


SalesTableModel.prototype.getColumn2l = function(uiColObj, xStart, yStart){
	var yScale = this.getYscaleForRow(uiColObj.items[0].items);
	return {
		key : uiColObj.key,
		x : xStart,
		y : yStart,
		h : this.colH,
		w : this.colW,
		cells : this.getCellsForRow3l(uiColObj, yScale)
	}
}

SalesTableModel.prototype.getTableFor1Level1 = function(uiTableObj){
	var yScale = this.getYscaleForRow(uiTableObj.items);
	var cells = this.getCellsForRow1l(uiTableObj, yScale);	
	return {
		tableTitle : uiTableObj.key,
		cells : cells,
		levels : 1
	}	
}

SalesTableModel.prototype.getCellsForRow1l = function(uiRowObj, yScale){
	var cX = this.cellStartX;
	var cY = this.cellStartY;
	var uiCells = uiRowObj.items;
	var cells = [];
	
	uiCells.forEach((function(b){
		cells.push({
			key : b.key,
			count : b.doc_count,
			x : cX,
			y : cY,
			w : this.cellW,
			h : yScale(b.doc_count)
		});
		cX += this.cellW;
	}).bind(this));

	return cells;
}
