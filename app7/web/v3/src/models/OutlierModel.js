function OutlierModel(){
	this.model = {
		axes : {
			x : {
				blocks : []
			},
			y : {
				blocks : []
			}
		}
	}
}

OutlierModel.prototype.getModel = function(apiRes, options){
	this.initAxes(apiRes, options);
	return this.model;
}

OutlierModel.prototype.initAxes = function(apiRes, options){
	this.initXAxis(apiRes, options);
	this.initYAxis(apiRes, options);
}

OutlierModel.prototype.initXAxis = function(apiRes, options){
	this.initYScale(apiRes, options);
	var tKeys = Object.keys(apiRes.results);
	var tKeysVsResultCount = {};
	var totalResults = 0;
	var availableW = options.w;
	var defaultW = 40;
	var defaultResSize = 4;
	var tKeysWithMoreResultsCount = 0;
	tKeys.forEach(function(tk){
		tKeysVsResultCount[tk] = apiRes.results[tk].length;
		totalResults += apiRes.results[tk].length;
		if(apiRes.results[tk].length < defaultResSize)
			availableW -= defaultW;
		else
			tKeysWithMoreResultsCount++;
	});
	var barW = availableW / totalResults;
	var blockW = availableW / tKeysWithMoreResultsCount;
	var x = 0;
	this.colors = this.getColors(totalResults);
	tKeys.forEach((function(tk){
		var rCnt = apiRes.results[tk].length;
		var bw = rCnt < defaultResSize ? defaultW/rCnt : barW;
		this.model.axes.x.blocks.push({
			label : tk,
			xS : x,
			yS : -(options.h/2 + 30),
			xE : rCnt < defaultResSize ? (x + defaultW) : (x + rCnt * bw),
			yE : -(options.h/2 + 30),
			bars : this.getBars(apiRes.results[tk], x, bw) 
		})
		x = rCnt < defaultResSize ? (x + defaultW) : (x + rCnt * bw);
	}).bind(this));

}

OutlierModel.prototype.initYAxis = function(apiRes, options){
	var xE = this.model.axes.x.blocks[this.model.axes.x.blocks.length - 1].xE;
	var yE = options.h/2;
	var yMax = this.model.yScale.domain()[1];
	for(var i = yE/4; i <= yE; i += yE/4){
		this.model.axes.y.blocks.push({
			xS : 0,
			yS : i,
			xE : xE,
			yE : i,
			label : Math.round((yMax/yE) * i) + '%'
		});
		this.model.axes.y.blocks.push({
			xS : 0,
			yS : -i,
			xE : xE,
			yE : -i,
			label : -Math.round((yMax/yE) * i) + '%'
		});
	}
}

OutlierModel.prototype.getBars = function(arrRes, xS, barW){
	var bars = [];
	var x = xS;
	arrRes.forEach((function(r){
		bars.push({
			xS : x,
			yS : 0,
			w : barW,
			h : this.model.yScale(Math.max(Math.abs(r.outlier), 200)),
			label : r.label,
			color : this.colors.pop(),
			outlier : r.outlier
		});
		x += barW;
	}).bind(this));
	return bars;
}

OutlierModel.prototype.initYScale = function(apiRes, options){
	var allVals = [];
	Object.keys(apiRes.results).forEach(function(tk){
		apiRes.results[tk].forEach(function(r){
			allVals.push(Math.abs(r.outlier));
		});		
	});
	var dS = 0;
	var dE = d3.max(allVals, function(v) {
				return v;
			 });

	var rS = 0;
	var rE = options.h/2;

	this.model.yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);

}
OutlierModel.prototype.getColors = function(cnt){
	var utils = new SvgUtils();
	var colors = [];
	while(colors.length < cnt){
		colors = colors.concat(utils.getDefaultColors());
	}
	return colors;
}
