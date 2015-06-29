function CompareTimeView(model, options){
	this.options = options;
	this.model = model;
	this.utils = new SvgUtils();
	this.groups = {
		axes : 'st-axis',
		times : 'st-time',
		backnext : 'st-backnext'
	}
}

CompareTimeView.prototype.render = function(){
	console.log(this.model);
	this.initYScale();
	this.addAxes();
}

CompareTimeView.prototype.initYScale = function(){
	var allValues = [];
	this.model.forEach(function(m){
		m.timeline.timeGroups.forEach(function(tg){
			Object.keys(tg).forEach(function(key){
				var count = tg[key].count || tg[key].totalCount;
				allValues.push(count);
			});
		});
	});
	var h = this.options.h;
	var dS = 0;
	var dE = d3.max(allValues, function(v) {
				return v;
			 });
	var rS = 0;
	var rE = h;
	this.yScale = d3.scale.linear()
					   	  .domain([dS, dE])
						  .range([rS, rE]);
	var xAxis = this.model[0].timeline.axes.x;
	var xAxisEnd = xAxis.labels[xAxis.labels.length - 1].xEnd;
	this.yLabels = [];					  
	for(var i = h/4 ; i <= h ; i += h/4){
		this.yLabels.push({
			xS : 0,
			yS : i,
			xE : xAxisEnd,
			yE : i,
			label : Math.round((dE/h) * i)
		});
	}
}

CompareTimeView.prototype.addAxes = function(g){
	var g = this.utils.getGroupByClassName(this.groups.axes);
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	g.attr('transform', xForm); 
	g.html('');
	this.addXAxis(g);
	this.addYAxis(g);
}

CompareTimeView.prototype.addXAxis = function(g){
	var xAxis = this.model[0].timeline.axes.x;
	this.utils.addLine(g, xAxis.xStart, 0, xAxis.xEnd, 0, 'chart-axis');
	xAxis.labels.forEach((function(l){
		this.utils.addTextXForm(g, (l.xStart + l.xEnd)/2, 15, l.label, 'st-text', 'middle');
		this.utils.addLine(g, l.xEnd, 0, l.xEnd, -6, 'chart-axis');
	}).bind(this));
}

CompareTimeView.prototype.addYAxis = function(g){
	var h = 0;
	this.utils.addLine(g, 0, 0, 0, this.options.h, 'chart-axis');
	this.yLabels.forEach((function(l){
		this.utils.addTextXForm(g, l.xS - 10, -l.yS, l.label, 'st-text', 'end');
		this.utils.addLine(g, l.xS, l.yS, l.xE, l.yE, 'chart-axis');
		h = l.yE;
	}).bind(this));
	var y = -h/2
	var x = -55;
	var gT = this.utils.addTextXForm(g, x, y, 'SALES', 'col-text', 'middle');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

