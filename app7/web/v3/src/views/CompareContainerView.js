function CompareContainerView(model, options){
	this.options = options;
	this.model = model;
	this.utils = new SvgUtils();
}

CompareContainerView.prototype.render = function(){
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	var g = this.utils.getGroupByClassName('sp-group');
	g.attr('transform', xForm.replace('-1', '1')).attr('id', 'arc');
	g.html('');

	var colors=this.utils.getDefaultColors();
	var data = [];
	var resultCount = 0;
	this.model.forEach(function(t){
		data.push({
			label : t.label,
			value : t.count,
			color : colors.pop()
		});
		resultCount += t.count;
	});
	
	this.utils.drawPie("arc", data, this.options.w/2, -this.options.h/2, 150, 120, 30, 0.4);

	var gH = this.utils.getGroupByClassName('sp-group-label');
	gH.attr('transform', xForm);
	this.utils.addTextXForm(gH, this.options.w/2, -this.options.h, 'TOTAL SALES - ' + resultCount, 'sales-header');
}
