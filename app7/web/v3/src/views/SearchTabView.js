function SearchTabView(model, options){	
	if(options.isCompareView){
		this.containerView = new CompareContainerView(model.container, options.container);
		this.timeView = new CompareTimeView(model.timeline, options.timeline);
	}
	else{
		this.containerView = new SearchContainerView(model.container, options.container);
		this.timeView = new SearchTimeView(model.timeline, options.timeline);
	}
}

SearchTabView.prototype.render = function(){
	this.containerView.render();
	this.timeView.render();
}