function SearchContainerView(model, options){
	this.model = model;
	this.options = options;
	this.utils = new SvgUtils();
	$(document).on('click', function(e){
		if($(e.target).attr('id') !== 'Others')
				$('#othersTooltip').remove();
	});
}

SearchContainerView.prototype.render = function(){
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	var g = this.utils.getGroupByClassName('sp-group');
	g.attr('transform', xForm.replace('-1', '1')).attr('id', 'arc');
	g.html('');

	var colors=this.utils.getDefaultColors();
	var data = [];

	this.model.sectors.top.forEach(function(t){
		data.push({
			label : t.key,
			value : t.count,
			color : colors.pop()
		});
	});
	if(this.model.sectors.othersCount > 0){
		data.push({
			label : "Others",
			value : this.model.sectors.othersCount,
			color : colors.pop()
		});
	}
	this.utils.drawPie("arc", data, this.options.w/2, -this.options.h/2, 150, 120, 30, 0.4);

	var self = this;
	$('.innerSlice, .topSlice, .outerSlice, .sp-pie-label').on('click', function(e){
		var l = d3.select(this).attr('id');
		if(l !== 'Others'){
			self.options.controller.executeSearch({
				qid : self.options.qid,
				source : 'container',
				label : l,
				type : self.model.type
			});
		}
		else
			self.showToolTip();
	});
}


SearchContainerView.prototype.showToolTip = function(){
	var $tt = $('<div id="othersTooltip">');
	this.model.sectors.others.forEach((function(o){
		var $a = $('<a href="#" class="others-item">');
		$a.html(o.key);
		$a.appendTo($tt);
	}).bind(this));
	$tt.appendTo($('body'));
	var self = this;
	$('.others-item').on('click', function(e){
		$('#othersTooltip').remove();
		self.options.controller.executeSearch({
			qid : self.options.qid,
			source : 'container',
			label : $(this).html(),
			type : self.model.type
		});
	});
}