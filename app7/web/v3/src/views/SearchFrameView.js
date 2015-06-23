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
	var keys = Object.keys(this.tabs);

}