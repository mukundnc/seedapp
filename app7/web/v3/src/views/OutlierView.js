function OutlierView(){
	this.groups = {
		graph : 'ol-graph'
	}
	this.utils = new SvgUtils();
}

OutlierView.prototype.render = function(model, options){
	this.model = model;
	this.options = options;
	console.log(this.model);
	$('.svg-view').empty();
	this.addAxes();
}

OutlierView.prototype.addAxes = function(){
	this.addXAxis();
	this.addYAxis();
	this.addEventHandlers();
}

OutlierView.prototype.addXAxis = function(){
	var g = this.utils.getGroupByClassName(this.groups.graph);
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	g.attr('transform', xForm);

	this.model.axes.x.blocks.forEach((function(block){
		this.utils.addLine(g, block.xS, block.yS, block.xE, block.yE, 'chart-axis');
		this.utils.addLine(g, block.xE, block.yE, block.xE, block.yE-10, 'chart-axis');
		this.utils.addTextXForm(g, (block.xS + block.xE)/2, -(block.yE-10), block.label, 'st-text', 'middle');
		block.bars.forEach((function(bar){
			var ry = bar.outlier > 0 ? 0 : -bar.h;
			var r = this.utils.addRect(g, bar.xS, ry, bar.w, bar.h, 'ol-bar');
			r.attr({
				style : 'fill:' + bar.color,
				label : bar.label
			});
			this.addBarLabel(g, bar);
		}).bind(this));
	}).bind(this));
}

OutlierView.prototype.addYAxis = function(){
	var g = this.utils.getGroupByClassName(this.groups.graph);
	var yE = 0;
	this.model.axes.y.blocks.forEach((function(block){
		this.utils.addLine(g, block.xS, block.yS, block.xE, block.yE, 'chart-axis');
		this.utils.addTextXForm(g, block.xS, -block.yS, block.label, 'st-text', 'end');
		if(block.yE > yE)
			yE = block.yE;
	}).bind(this));
	var xS = this.model.axes.x.blocks[0].xS;
	var yS = this.model.axes.x.blocks[0].yS;
	this.utils.addLine(g, xS, yS, xS, yE, 'chart-axis');
	xS = this.model.axes.x.blocks[0].bars[0].xS;
	yS = this.model.axes.x.blocks[0].bars[0].yS;
	this.utils.addTextXForm(g, xS-10, yS, '0%', 'st-text', 'end');

}

OutlierView.prototype.addBarLabel = function(g, bar){
	bar.outlier > 0 ? this.addPositiveBarLabel(g, bar) : this.addNegativeBarLabel(g, bar);
}

OutlierView.prototype.addPositiveBarLabel = function(g, bar){
	var x = bar.xS + bar.w/2 + 2;
	var y = -bar.h - 2 ;
	var l = bar.label;
	var gT = this.utils.addTextXForm(g, x, y, l, 'ol-chart-label', 'start');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

OutlierView.prototype.addNegativeBarLabel = function(g, bar){
	var x = bar.xS + bar.w/2 + 2;
	var y = bar.h + 2 ;
	var l = bar.label;
	var gT = this.utils.addTextXForm(g, x, y, l, 'ol-chart-label', 'end');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

OutlierView.prototype.addEventHandlers = function(){
	var self = this;
	$('.ol-bar').on('click', function(e){
		var selLabel = d3.select(this).attr('label');
		self.options.controller.executeOutlierDrilldownSearch(selLabel, self.options.qid, self.model.line);
	});
}