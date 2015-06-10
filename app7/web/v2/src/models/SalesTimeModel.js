function SalesTimeModel(options){
	this.xStart = options.frmStartX;
	this.yStart = options.frmStartY;
	this.width = options.frmWidth;
	this.height = options.frmHeight;
}


SalesTimeModel.prototype.getCategorySalesInTime = function(salesCategories){
	var yScale = this.getScale(salesCategories);

	var years = salesCategories[0].yearly.buckets;
	var yearsL = years.length;
	var yearsW = (this.width - this.xStart) / yearsL;
	var yearsH = (this.height - this.yStart) / yearsL;
	var cW = padding = yearsW / (8 * yearsL);
	var xS = this.xStart + padding;
	var yS = this.yStart;
	
	var data = {};
	
	years.forEach((function(y){
		var yKey = new Date(y.key).getFullYear();
		var yIndex = yKey - 2000;
		data[yKey] = {};
		var iCat = 0;
		salesCategories.forEach((function(catYearSale){
			var cKey = catYearSale.key;
			data[yKey][cKey] = {
				x : xS,
				y : yS,
				W : cW,
				H : yScale(catYearSale.yearly.buckets[yIndex].doc_count),
				count : catYearSale.yearly.buckets[yIndex].doc_count
			};			
			xS += (cW + padding);
		}).bind(this));
	}).bind(this));
	return data;
}

SalesTimeModel.prototype.getScale = function(salesCategories){
	var allYears = [];
	salesCategories.forEach(function(sc){
		allYears = allYears.concat(sc.yearly.buckets);
	});
	var dS = d3.min(allYears, function(y) {
				return y.doc_count
			 });
	var dE = d3.max(allYears, function(y) {
				return y.doc_count
			 });

	var rS = this.yStart;
	var rE = this.height;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);
	return yScale;	
}

