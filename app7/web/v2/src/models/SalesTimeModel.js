function SalesTimeModel(){

}

SalesTimeModel.prototype.init = function(options){
	this.options = options;

}

SalesTimeModel.prototype.getModel = function(uiTimeObj, options){
	this.init(options);
	console.log('m here');
}