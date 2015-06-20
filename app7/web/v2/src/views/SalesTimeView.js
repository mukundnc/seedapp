function SalesTimeView(){
	this.utils = new SvgUtils();
}

SalesTimeView.prototype.init = function(timeModel, options){
	this.options = options;
	this.model = timeModel;
	this.clear();
}

SalesTimeView.prototype.clear = function(){
	d3.select('.svg-container').select('.svg-view').html('');
}

SalesTimeView.prototype.render = function(timeModel, options){
	this.init(timeModel, options);
	this.addTimeGroupLabels();
	this.renderTimeGroupForCurrentSelection();
}

SalesTimeView.prototype.getTimeSvgGroup = function(){
	var g = d3.select('.svg-container').select('.svg-view').select('.sales-time');
	if(g.empty()){
		g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('transform', 'translate(' + this.options.xOrg + ',' + this.options.yOrg + ') scale(1, -1)')
		      .attr('class', 'sales-time');
	}
	return g;
}

SalesTimeView.prototype.getTimeLabelsSvgGroup = function(){
	var g = d3.select('.svg-container').select('.svg-view').select('.sales-time-labels');
	if(g.empty()){
		g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('transform', 'translate(' + this.options.xOrg + ',' + this.options.yOrg + ') scale(1, -1)')
		      .attr('class', 'sales-time-label');
	}
	return g;
}

SalesTimeView.prototype.addTimeGroupLabels = function(){
	var g = this.getTimeLabelsSvgGroup();
	var xS = this.options.w - 250;
	var yS = this.options.h - 90;
	var rH = 25;
	var rW = 70;
	var gR = null;
	Object.keys(this.model).forEach((function(mk){
		if(this.model[mk].timeGroups.length > 0){
			gR = this.utils.addRectLabel(g, xS, yS, rW, rH, strToFirstUpper(this.model[mk].type), 'st-labels', 'st-rect', 'st-text', 'start');
			gR.select('rect').attr('id', this.model[mk].type);
			yS += rH;
		}
	}).bind(this));
	if(!gR.empty()){
		gR.select('rect').classed('st-select', true);
		gR.select('text').classed('st-text-select', true);
	}
	var self = this;
	$('.st-labels').on('click', function(e){
		self.onTimeLabelChange(this);
	});
	
}

SalesTimeView.prototype.renderTimeGroupForCurrentSelection = function(){
	var g = this.getTimeLabelsSvgGroup();
	var selRect = d3.selectAll('.st-select');
	var id = selRect.attr('id');
	var key = '';
	for( var k in this.model){
		if(this.model[k].type === id){
			key = k;
			break;
		}
	}
	var timeGroups = this.model[key].timeGroups;
	this.addTimeGroupBackNext(timeGroups.length);
	this.renderTimeGroup(timeGroups[0]);
}

SalesTimeView.prototype.onTimeLabelChange = function(selTimeLabel){
	d3.selectAll('.st-select').classed('st-select', false).classed('st-rect', true);
	d3.selectAll('.st-text-select').classed('st-text-select', false).classed('st-text', true);
	d3.select(selTimeLabel).select('rect').attr('class', 'st-select');
	d3.select(selTimeLabel).select('text').attr('class', 'st-text-select');
	this.renderTimeGroupForCurrentSelection();
}

SalesTimeView.prototype.addTimeGroupBackNext = function(tgCount){
	var g = this.getTimeLabelsSvgGroup();
	g.html('');

	if(tgCount < 6) return;
		
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
}

SalesTimeView.prototype.renderTimeGroup = function(timeGroup){
	var g = this.getTimeSvgGroup();
	g.html('');
	var xEnd = 0;
	var yEnd = 0;
	var allHeights = [];
	timeGroup.blocks.forEach((function(block){
		var i = 1;
		block.bars.forEach((function(bar){
			this.renderBar(g, bar, 'bar-' + i + ' bh');
			allHeights.push(bar.h);
			if(bar.h > yEnd)
				yEnd = bar.h;
			i++;
		}).bind(this));
		this.addBlockLabel(g, block);
		xEnd = block.xEnd;
	}).bind(this));
	this.utils.addLine(g, 0, 0, xEnd, 0, 'chart-axis');
	this.addYAxisLabels(g, xEnd, yEnd, timeGroup);
	this.addMarkers(g, xEnd, timeGroup);
	this.animateCategoryHeights(g, allHeights);
}

SalesTimeView.prototype.animateCategoryHeights = function(g, heights){
	g.selectAll('.bh')
	 .data(heights)
	 .transition()
	 .attr('height', function(h) { return h; })
}


SalesTimeView.prototype.renderBar = function(g, bar, cssRect){
	if(bar.h === 0) return;

	this.utils.addRect(g, bar.x, bar.y, bar.w, 0, cssRect);
}

SalesTimeView.prototype.addBlockLabel = function(g, block){
	this.utils.addLine(g, block.xEnd, 0, block.xEnd, -6, 'chart-axis');
	var xC = (block.xStart + block.xEnd)/2;
	var yC = 10;

	this.utils.addTextXForm(g, xC, yC, block.label, 'col-text', 'middle');
}

SalesTimeView.prototype.addYAxisLabels = function(g, w, h, timeGroup){
	this.utils.addLine(g, 0, h/4, w, h/4, 'chart-axis');
	this.utils.addLine(g, 0, h/2, w, h/2, 'chart-axis');
	this.utils.addLine(g, 0, 3*h/4, w, 3*h/4, 'chart-axis');
	this.utils.addLine(g, 0, h, w, h, 'chart-axis');
	this.utils.addLine(g, 0, 0, 0, h, 'chart-axis');

	var max = timeGroup.yScale.domain()[1];
	this.utils.addTextXForm(g, -20, -h/4, Math.round(max/4), 'col-text', 'end');
	this.utils.addTextXForm(g, -20, -h/2, Math.round(max/2), 'col-text', 'end');
	this.utils.addTextXForm(g, -20, -3*h/4, Math.round(3*max/4), 'col-text', 'end');
	this.utils.addTextXForm(g, -20, -h, Math.round(max), 'col-text', 'end');

	var y = -h/2
	var x = -55;
	var gT = this.utils.addTextXForm(g, x, y, 'SALES', 'col-text', 'middle');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

SalesTimeView.prototype.addMarkers = function(g, xEnd, timeGroup){
	var x = xEnd/4;
	var y = -40;
	var i = 1;
	timeGroup.contentLabels.forEach((function(c){
		this.utils.addRect(g, x, y, 10, 10, 'bar-'+i);
		this.utils.addTextXForm(g, x + 30, -y, c, 'col-text', 'middle');
		x+=80;
		i++;
	}).bind(this));
}