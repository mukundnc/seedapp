function SearchTabView(model, options){
	this.containerView = new SearchContainerView(model.container, options.container);
	this.timeView = new SearchTimeView(model.timeline, options.timeline);
}

SearchTabView.prototype.render = function(){
	this.containerView.render();
	this.timeView.render();
}