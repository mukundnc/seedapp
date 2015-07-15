function OutlierModel(){
	this.axes = {
		x : {
			labels : []
		}
	}
}

OutlierModel.prototype.getModel = function(results, options){
	return this;
}