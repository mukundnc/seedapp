function SalesTimeView(){
	this.utils = new SvgUtils();
}

SalesTimeView.prototype.init = function(timeModel, options){
	this.options = options;
	this.model = timeModel;
}

SalesTimeView.prototype.render = function(timeModel, options){
console.log(timeModel);	
	this.init(timeModel, options);
	this.renderTimeGroupsForKey('key1');
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

SalesTimeView.prototype.renderTimeGroupsForKey = function(tgKey){
	if(!this.model[tgKey] || this.model[tgKey].timeGroups.length === 0) return;

	var timeGroups = this.model[tgKey].timeGroups;
	this.addTimeGroupLabels(timeGroups.length);
	this.renderTimeGroup(timeGroups[0]);
}

SalesTimeView.prototype.addTimeGroupLabels = function(tgCount){
	var g = this.getTimeLabelsSvgGroup();
	var xS = this.options.w - 250;
	var yS = this.options.h - 90;
	var rH = 25;
	var rW = 70;
	var gR = null;
	this.options.titles.forEach((function(label){
		gR = this.utils.addRectLabel(g, xS, yS, rW, rH, label, 'st-labels', 'st-rect', 'st-text', 'start');
		gR.attr('id', 'st' + label);
		yS += rH;
	}).bind(this));
	gR.select('rect').classed('st-select', true);
	gR.select('text').classed('st-text-select', true);
	var self = this;
	$('.st-labels').on('click', function(e){
		self.onTimeLabelChange(this);
	});
}

SalesTimeView.prototype.onTimeLabelChange = function(selTimeLabel){
	d3.selectAll('.st-select').classed('st-select', false).classed('st-rect', true);
	d3.selectAll('.st-text-select').classed('st-text-select', false).classed('st-text', true);
	d3.select(selTimeLabel).select('rect').attr('class', 'st-select');
	d3.select(selTimeLabel).select('text').attr('class', 'st-text-select');
}

SalesTimeView.prototype.renderTimeGroup = function(timeGroup){
	var g = this.getTimeSvgGroup();
	g.html('');
}