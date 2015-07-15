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
			var r = this.utils.addRect(g, bar.xS, ry, bar.w, bar.h, '');
			r.attr({
				style : 'fill:' + bar.color,
				label : bar.label
			});
		}).bind(this));
	}).bind(this));
}

OutlierView.prototype.addYAxis = function(){

}

