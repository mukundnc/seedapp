function SearchContainerView(model, options){
	this.model = model;
	this.options = options;
}

SearchContainerView.prototype.render = function(){
	console.log(this.model);
	console.log(this.options);
}