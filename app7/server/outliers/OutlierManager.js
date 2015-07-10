function OutlierManager(apiController){
	this.apiController = apiController;
}

OutlierManager.prototype.handleOutlierRequest = function(req, res){
	var resp = {		
		json : function(data){
			res.json(data);
		}
	}

	this.apiController.handleSearchRequest(req, resp);
}

module.exports = OutlierManager;