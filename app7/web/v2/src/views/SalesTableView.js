function SalesTableView(){

}

SalesTableView.prototype.render = function(model, options){
	this.options = options;
	this.meta = model.meta;
console.log(model);
	
	var g = this.addTableGroup();

	model.columns.forEach((function(col){
		
		this.addRectLabel(g, col.x, col.y, col.w, col.h, col.name, 'col-rect', 'col-text')
		g.append('line').attr({x2:'0', y2:this.options.frmHeight, style:'stroke:white; stroke-width: 1px'})

	}).bind(this));

	d3.select('.col-rect').classed('col-select', true);
	d3.select('.col-text').classed('text-select', true);
}

SalesTableView.prototype.addTableGroup = function(){
	var transform = 'translate(' + this.options.frmStartX  + ',' + this.options.frmStartY + ') scale(1, -1)';
	var css = 'sales-table-group';	
	var g = d3.selectAll('svg')
			  .append('g')
			  .attr({
			  	transform : transform,
			  	class : css
			  });
	
	return g;
}

SalesTableView.prototype.addRectLabel = function(g, x, y, w, h, text, cssRect, cssText, textAlign){
	var r = g.append('rect')
			 .attr({
			 	x : x,
			 	y : y,
			 	height : h,
			 	width : w,
			 	class : cssRect || 'col-rect'
			 });
			 this.addText(g, x+w/4, -(y+h/2-3), text, cssText, 'center');
	return r;
}

SalesTableView.prototype.addText = function(g, x, y, text, cssText, textAlign){
	var t = g.append('g')
			 .attr('transform', 'scale(1, -1)')
			 .append('text')
			 .attr({
			 	x : x,
			 	y : y,
			 	class : cssText || 'col-text',
			 	'text-anchor' : textAlign || 'middle'
			 })
			 .text(text);
	return t;	
}