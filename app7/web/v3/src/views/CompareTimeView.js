function CompareTimeView(model, options){
	this.options = options;
	this.model = model;
	this.utils = new SvgUtils();
	this.groups = {
		axes : 'st-axis',
		times : 'st-time',
		backnext : 'st-backnext'
	}
	this.xAxisEnd = this.options.w;
}

CompareTimeView.prototype.render = function(){
	this.initYScale();
	this.addAxes();
	this.addTimeLines();
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
	this.xAxisEnd = xAxis.labels[xAxis.labels.length - 1].xEnd;
	this.yLabels = [];					  
	for(var i = h/4 ; i <= h ; i += h/4){
		this.yLabels.push({
			xS : 0,
			yS : i,
			xE : this.xAxisEnd,
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

CompareTimeView.prototype.getXLabelEndPoints = function(xlabel){
	var xLabel = _.where(this.model[0].timeline.axes.x.labels, {label : xlabel})[0];
	return {
		xS : xLabel.xStart,
		xE : xLabel.xEnd
	};
}

CompareTimeView.prototype.addTimeLines = function(){
	var g = this.utils.getGroupByClassName(this.groups.times);
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	g.attr('transform', xForm); 
	g.html('');	
	var self = this;
	var colors = this.utils.getDefaultColors();
	var mapLabelVsColor = {};
	this.model.forEach(function(m){
		m.timeline.timeGroups.forEach(function(tg){
			var c = colors.pop();
			mapLabelVsColor[m.label] = c;
			self.addTimeLine(g, tg, m.label, c);
		});
	});	
	this.addLabelMarkers(g, mapLabelVsColor);
}

CompareTimeView.prototype.addTimeLine = function(g, timeGroup, tlLabel, tlColor){
	var i = 0;
	var path = new Path();
	Object.keys(timeGroup).forEach((function(xLabel){
		var count = 0;
		if(!_.isUndefined(timeGroup[xLabel].count))
			count = timeGroup[xLabel].count;
		else if(!_.isUndefined(timeGroup[xLabel].totalCount))
			count = timeGroup[xLabel].totalCount;
		var xL = this.getXLabelEndPoints(xLabel);
		var x = (xL.xS + xL.xE)/2;
		var y = this.yScale(count);
		i === 0 ? path.moveTo(x, y) : path.lineTo(x, y);
		i++
	}).bind(this));
	var p = g.append('path')
			 .attr({
			 	d : path.toString().replace('Z',''),
			 	class : 'def-chart-line',
			 	stroke : tlColor
			 });
}

CompareTimeView.prototype.addLabelMarkers = function(g, mapLabelVsColor){
	var xS = this.xAxisEnd + 20;
	var yS = this.options.h - 10;

	for(var label in mapLabelVsColor){
		var color = mapLabelVsColor[label];
		var d = 10;
		var x1 = xS;
		var x2 = x1 + d;

		var l1 = this.utils.addLine(g, x1, yS, x2, yS, 'chart-label-line');
		l1.attr('stroke', color);

		x1 = x2;
		x2 = x1+d;

		var r = this.utils.addRect(g, x1, yS-d/2, d, d, '');
		r.attr('fill', color);
		
		x1 = x2;
		x2 = x1+d;

		var l2 = this.utils.addLine(g, x1, yS, x2, yS, 'chart-label-line');
		l2.attr('stroke', color);

		x1 = x2;
		x2 = x1+d;

		var gT = this.utils.addTextXForm(g, x2, -yS + 4, label, 'chart-label', 'start');
		gT.select('text').attr('fill', color);

		yS -= 20;
	}
}