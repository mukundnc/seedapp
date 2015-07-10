function OutlierManager(apiController){
	this.apiController = apiController;
}

OutlierManager.prototype.handleOutlierRequest = function(req, res){
	var resp = {		
		json : function(data){
			res.json(data);
		}
	}
	var query = decodeURIComponent(req.query.q).toLowerCase();	
	var mode = decodeURIComponent(req.query.mode).toLowerCase();	
	var line = decodeURIComponent(req.query.line).toLowerCase();		
	this.apiController.handleSearchRequest(req, resp);
}`

module.exports = OutlierManager;