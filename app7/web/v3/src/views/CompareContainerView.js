function CompareContainerView(model, options){
	this.options = options;
	this.model = model;
}

CompareContainerView.prototype.render = function(){
	console.log(this.model);
}
