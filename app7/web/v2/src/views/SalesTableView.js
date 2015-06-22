function SalesTableView(){
	this.utils = new SvgUtils();
	this.groups = {
		cols : 'st-cols',
		rows : 'st-rows',
		cells : 'st-cells'
	}
}

SalesTableView.prototype.init = function(model, options){
	this.model = model;
	this.options = options;
}

SalesTableView.prototype.render = function(model, options){
	this.init(model, options);

	var g = this.getGroupById(this.groups.cells);

	this.utils.addLine(g, 0, 0, 0, this.options.h, 'chart-axis');
}

SalesTableView.prototype.getGroupById = function(clsName){
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