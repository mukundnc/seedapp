function CompareContainerView(model, options){
	this.options = options;
	this.model = model;
	this.utils = new SvgUtils();
}

CompareContainerView.prototype.render = function(){
	console.log(this.model);
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	var g = this.utils.getGroupByClassName('sp-group');
	g.attr('transform', xForm.replace('-1', '1')).attr('id', 'arc');
	g.html('');

	var colors=["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#2b908f"];
	var data = [];
	this.model.forEach(function(t){
		data.push({
			label : t.label,
			value : t.count,
			color : colors.pop()
		});
	});
	
	this.utils.drawPie("arc", data, this.options.w/2, -this.options.h/2, 150, 120, 30, 0.4);
}
