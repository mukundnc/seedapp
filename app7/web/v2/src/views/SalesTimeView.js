function SalesTimeView(){
	this.utils = new SvgUtils();
}

SalesTimeView.prototype.init = function(options){
	this.options = options;
}

SalesTimeView.prototype.render = function(timeModel, options){
	this.init(options);
	var g = this.addTimeGroup();
	this.utils.addLine(g, 0,0, 
		                  this.options.w, this.options.h,
		                  'chart-axis');
}

SalesTimeView.prototype.addTimeGroup = function(){
	var g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('transform', 'translate(' + this.options.xOrg + ',' + this.options.yOrg + ') scale(1, -1)')
		      .attr('class', 'sales-time');
	return g;
}