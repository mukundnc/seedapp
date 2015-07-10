
var OutlierTop = require('./OutlierTop');

function OutlierManager(apiController){
	this.apiController = apiController;
}

OutlierManager.prototype.handleOutlierRequest = function(reqHttp, resHttp){
	function cbOnDone(data){
		resHttp.json(data);
	}
	var query = decodeURIComponent(reqHttp.query.q).toLowerCase();	
	var mode = decodeURIComponent(reqHttp.query.mode).toLowerCase();	
	var line = decodeURIComponent(reqHttp.query.line).toLowerCase();	

	if(mode === 'top')
		this.executeOutliersForTopMode(reqHttp, line, cbOnDone)
	
}

OutlierManager.prototype.executeOutliersForTopMode = function(reqHttp, line, cbOnDone){
	var outlierTop = new OutlierTop();
	var onSearchQueryResponse = {
		json : function(res){
			outlierTop.getOutliersForTop(res, line, cbOnDone);
		}
	}
	this.apiController.handleSearchRequest(reqHttp, onSearchQueryResponse);
}


module.exports = OutlierManager;