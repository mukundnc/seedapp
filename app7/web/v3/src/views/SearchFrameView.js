function SearchFrameView(model, options){
	this.model = model;
	this.options = options;
	this.tabs = {};
	this.activeTab = null;
	this.utils = new SvgUtils();

	var productTypes = ['categories', 'types', 'brands', 'models'];
	var regionTypes = ['regions', 'states', 'cities'];

	model.forEach((function(frame){
		if(productTypes.indexOf(frame.type) !== -1){
			this.tabs['product'] = {
				view : new SearchTabView(frame, options),
				model : frame
			}
		}
		if(regionTypes.indexOf(frame.type) !== -1){
			this.tabs['region'] = {
				view : new SearchTabView(frame, options),
				model : frame
			}
		}
	}).bind(this));
}

SearchFrameView.prototype.render = function(){
	this.renderTabs();

	if(this.tabs['product']){
		this.tabs['product'].view.render();
		this.activeTab = 'product';
	}
	else if (this.tabs['region']){
		this.tabs['region'].view.render();
		this.activeTab = 'region';
	}
}

SearchFrameView.prototype.renderTabs = function(){
	var tabH = 30;
	var tabW = 80;
	var xOrg = 0;
	var xForm = this.utils.getCodtSystemXForm(xOrg, tabH);
	var g = this.utils.getGroupByClassName('sf-frame-group');
	g.attr('transform', xForm);
	d3.selectAll('.svg-view').html('');
	this.utils.addTextXForm(g, this.options.w/2, 0, 'TOTAL SALES - ' + this.options.resultCount, 'sales-header');
	var keys = Object.keys(this.tabs);
	var cssRect = 'sf-rect-select', cssText = 'sf-text-select', i = 0;
	keys.forEach((function(key){
		if(i > 0){
			cssRect = 'sf-rect';
			cssText = 'sf-text';	
		}
		var gL = this.utils.addRectLabel(g, xOrg, 0, tabW, tabH, this.tabs[key].model.label, 'sf-tab', cssRect, cssText, 'middle');
		gL.attr('id', key);
		gL.select('text')
		  .attr({
		  	x : xOrg + tabW/2,
		  	'text-anchor' : 'middle'
		  })
		xOrg += tabW;
		i++;
	}).bind(this));
	
	var self = this;
	$('.sf-tab').on('click', function(e){
		self.onTabChange(this);
	});
}

SearchFrameView.prototype.onTabChange = function(selTab){
	d3.selectAll('.sf-rect-select').classed('sf-rect-select', false).classed('sf-rect', true);
	d3.selectAll('.sf-text-select').classed('sf-text-select', false).classed('sf-text', true);
	d3.select(selTab).select('rect').attr('class', 'sf-rect-select');
	d3.select(selTab).select('text').attr('class', 'sf-text-select');
	var id = d3.select(selTab).attr('id');
	this.tabs[id].view.render();
}





