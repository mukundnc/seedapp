function OutlierView(){

}

OutlierView.prototype.render = function(model, options){
	this.model = model;
	this.options = options;
	console.log(this.model);
}