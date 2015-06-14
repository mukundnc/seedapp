function SearchTreeView(options){
	this.options = options;
	this.utils = new SvgUtils();
	this.W = $('.svg-tree-container').width();
	this.H = $('.svg-tree-container').height();
	this.top = 20;
	this.left = 20;
	d3.select('.svg-tree-container')
	  .select('.svg-tree')
	  .attr({
	  	height : this.H,
	  	width : this.W
	  })
	this.addRoot();
	this.hOffset = 20;
	this.wOffset = 20;
	this.currX = this.left + this.wOffset;
	this.currY = this.top;
}

SearchTreeView.prototype.addRoot = function(){
	var g = d3.select('.svg-tree')
	  		  .append('g')
	  		  .attr('class', 'snode-container');
	this.utils.addText(g, this.left, this.top, 'Search', 'snode-root-text', 'start');

}

SearchTreeView.prototype.getG = function(){
	return d3.select('.svg-tree-container').select('.snode-container');
}

SearchTreeView.prototype.add = function(params){
	var x1 = this.currX;
	var y1 = this.currY;
	var x2 = x1;
	var y2 = y1 + this.hOffset;
	var x3 = x1 + this.wOffset;
	var y3 = y2;
	var g = this.getG();
	this.utils.addLine(g, x1, y1, x2, y2, 'snode-marker-line');
	this.utils.addLine(g, x2, y2, x3, y3, 'snode-marker-line');
	this.utils.addText(g, x3, y3 + 5,  params.name, 'snode-text', 'start');
	this.currX = x2;
	this.currY = y2;
}
