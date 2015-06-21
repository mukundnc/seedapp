function SalesTimeView(){
	this.utils = new SvgUtils();
	this.groups = {
		axes : 'st-axis',
		times : 'st-time',
		choices : 'st-choice',
		backnext : 'st-backnext'
	}
}

SalesTimeView.prototype.init = function(timeModel, options){
	this.options = options;
	this.model = timeModel;
	this.currTimeModelIndex = 0;
	this.clear();
}

SalesTimeView.prototype.clear = function(){
	d3.select('.svg-container').select('.svg-view').html('');
}

SalesTimeView.prototype.render = function(timeModel, options){
	this.init(timeModel, options);
	this.addViewTypeChoices();
	this.addAxes();
	this.showTimeView();
}

SalesTimeView.prototype.getGroupByClassName = function(clsName){
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

SalesTimeView.prototype.getGroupById = function(id){
	return this.getGroupByClassName(id);
}

SalesTimeView.prototype.addViewTypeChoices = function(){
	var g = this.getGroupById(this.groups.choices);
	var xS = this.options.w - 250;
	var yS = this.options.h - 65;
	var rH = 25;
	var rW = 70;
	var keys = ['key1', 'key2'];
	var arr = [];
	keys.forEach((function(mk){
		if(this.model[mk].timeGroups.length > 0){
			var gR = this.utils.addRectLabel(g, xS, yS, rW, rH, strToFirstUpper(this.model[mk].type), 'st-choices', 'st-rect', 'st-text', 'start');
			gR.select('rect').attr('id', this.model[mk].type);
			yS -= rH;
			arr.push(gR);
		}
	}).bind(this));
	if(!arr[0].empty()){
		arr[0].select('rect').classed('st-select', true);
		arr[0].select('text').classed('st-text-select', true);
	}
	var self = this;
	$('.st-choices').on('click', function(e){
		self.onViewTypeChange(this);
	});
}

SalesTimeView.prototype.onViewTypeChange = function(selTimeLabel){
	d3.selectAll('.st-select').classed('st-select', false).classed('st-rect', true);
	d3.selectAll('.st-text-select').classed('st-text-select', false).classed('st-text', true);
	d3.select(selTimeLabel).select('rect').attr('class', 'st-select');
	d3.select(selTimeLabel).select('text').attr('class', 'st-text-select');
	this.currTimeModelIndex = 0;
	this.getGroupById(this.groups.axes).html('');
	this.addAxes();
	this.showTimeView();
}

SalesTimeView.prototype.getViewKeyForCurrentSelection = function(){
	var selRect = d3.selectAll('.st-select');
	var id = selRect.attr('id');
	for( var k in this.model){
		if(this.model[k].type === id){
			return k;
		}
	}
}

SalesTimeView.prototype.addAxes = function(){
	this.addXAxis();
	this.addYAxis();
}

SalesTimeView.prototype.addXAxis = function(){
	var g = this.getGroupById(this.groups.axes);
	var xAxis = this.model.axes.x;
	this.utils.addLine(g, xAxis.xStart, 0, xAxis.xEnd, 0, 'chart-axis');
	xAxis.labels.forEach((function(l){
		this.utils.addTextXForm(g, (l.xStart + l.xEnd)/2, 15, l.label, 'st-text', 'middle');
		this.utils.addLine(g, l.xEnd, 0, l.xEnd, -6, 'chart-axis');
	}).bind(this));
}

SalesTimeView.prototype.addYAxis = function(){
	var g = this.getGroupById(this.groups.axes);
	var yAxis = this.model.axes.y;
	var key = this.getViewKeyForCurrentSelection();
	var h = 0;
	this.utils.addLine(g, yAxis.xStar, yAxis.yStart, yAxis.xEnd, yAxis.yEnd, 'chart-axis');
	yAxis[key].labels.forEach((function(l){
		this.utils.addTextXForm(g, l.xStart - 10, -l.yStart, l.label, 'st-text', 'end');
		this.utils.addLine(g, l.xStart, l.yStart, l.xEnd, l.yEnd, 'chart-axis');
		h = l.yEnd;
	}).bind(this));
	var y = -h/2
	var x = -55;
	var gT = this.utils.addTextXForm(g, x, y, 'SALES', 'col-text', 'middle');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

SalesTimeView.prototype.showTimeView = function(){
	var g = this.getGroupById(this.groups.times);
	g.html('');
	this.showBackNextControls();
	this.showTimeGroupView();
}

SalesTimeView.prototype.showBackNextControls = function(){
	var g = this.getGroupById(this.groups.backnext);
	g.html('');

	var key = this.getViewKeyForCurrentSelection();
	var timeGroups = this.model[key].timeGroups;
	if(timeGroups.length < 2) return;

	var xS = this.options.w - 250;
	var yS = this.options.h - 120;
	var rH = 15;
	var rW = 15;
	var gR = null;
	var labels = ['<', '>'];
	var id = 'stBack';
	labels.forEach((function(label){
		gR = this.utils.addRectLabel(g, xS, yS, rW, rH, label, 'st-bn', 'st-bn-rect', 'st-bn-text', 'start');
		gR.attr('id', id);
		id = 'stNext';
		xS += rW;
	}).bind(this));
	gR.select('rect').classed('st-bn-select', true);
	gR.select('text').classed('st-bn-text-select', true);
	var self = this;
	$('.st-bn').on('click', function(e){
		self.onTimeGroupBackNext(this);
	});

}

SalesTimeView.prototype.onTimeGroupBackNext = function(selBackNext){
	d3.selectAll('.st-bn-select').classed('st-bn-select', false).classed('st-bn-rect', true);
	d3.selectAll('.st-bn-text-select').classed('st-bn-text-select', false).classed('st-bn-text', true);
	d3.select(selBackNext).select('rect').attr('class', 'st-bn-select');
	d3.select(selBackNext).select('text').attr('class', 'st-bn-text-select');
	var id = d3.select(selBackNext).attr('id');
	var modelKey = this.getViewKeyForCurrentSelection();
	var timeGroups = this.model[modelKey].timeGroups;
	if(id === 'stBack'){
		this.currTimeModelIndex--;
		if(this.currTimeModelIndex < 0){
			this.currTimeModelIndex = 0;
			return;
		}
	}
	else{
		this.currTimeModelIndex++;		
		if(this.currTimeModelIndex >= timeGroups.length){
			this.currTimeModelIndex = timeGroups.length-1;
			return;
		}
	}
	this.showTimeGroupView();
}

SalesTimeView.prototype.showTimeGroupView = function(){
	var g = this.getGroupById(this.groups.times);
	g.html('');

	var modelKey = this.getViewKeyForCurrentSelection();
	var timeGroup = this.model[modelKey].timeGroups[this.currTimeModelIndex];
	var allHeights = [];

	for(var key in timeGroup){
		var bars = timeGroup[key];
		var i = 1;
		bars.forEach((function(bar){
			if(bar.h > 0){
				this.utils.addRect(g, bar.x, bar.y, bar.w, 0, 'bar-' + i + ' bh');
				allHeights.push(bar.h);
			}
			i++;
		}).bind(this));
	}
	this.addTimeGroupContentMarkers(g);
	this.addCountHeader(g);
	this.animateCategoryHeights(g, allHeights);
}

SalesTimeView.prototype.animateCategoryHeights = function(g, heights){
	g.selectAll('.bh')
	 .data(heights)
	 .transition()
	 .attr('height', function(h) { return h; })
}

SalesTimeView.prototype.addTimeGroupContentMarkers = function(g){
	var modelKey = this.getViewKeyForCurrentSelection();
	var timeGroup = this.model[modelKey].timeGroups[this.currTimeModelIndex];
	var key = Object.keys(timeGroup)[0];
	var labels = [];
	timeGroup[key].forEach(function(l){
		labels.push(l.label);
	});

	var maxStrLen = d3.max(labels, function(s) { return s.length; });
	var d1 = 40;
	var d2 = d1 + 40;
	if(maxStrLen > 10){
		d2 += 30;
		d1 += 20;
	}

	var x = this.model.axes.x.xEnd/4;
	var y = -40;
	var i = 1;
	labels.forEach((function(c){
		this.utils.addRect(g, x, y, 10, 10, 'bar-'+i);
		this.utils.addTextXForm(g, x + d1, -y, c, 'col-text', 'middle');
		x+=d2;
		i++;
	}).bind(this));

}

SalesTimeView.prototype.addCountHeader = function(g){
	var xC = (this.model.axes.x.xStart + this.model.axes.x.xEnd)/2;
	var yC = this.options.h - 55;

	this.utils.addTextXForm(g, xC, -yC, 'TOTAL SALES - ' + this.options.resultsCount, 'sales-header');
}