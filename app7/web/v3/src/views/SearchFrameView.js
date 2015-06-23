function SearchFrameView(model, options){
	this.model = model;
	this.options = options;
	this.tabs = {};

	var productTypes = ['categories', 'types', 'brands', 'models'];
	var regionTypes = ['regions', 'states', 'cities'];

	model.forEach((function(frame){
		if(productTypes.indexOf(frame.type) !== -1){
			this.tabs['product'] = new SearchTabView(frame, options);
		}
		if(regionTypes.indexOf(frame.type) !== -1){
			this.tabs['region'] = new SearchTabView(frame, options);
		}
	}).bind(this));
}

SearchFrameView.prototype.render = function(){
	this.renderTabs();

	if(this.tabs['product'])
		this.tabs['product'].render();
	else if (this.tabs['region'])
		this.tabs['region'].render()
}

SearchFrameView.prototype.renderTabs = function(){
	var keys = Object.keys(this.tabs);
	
}