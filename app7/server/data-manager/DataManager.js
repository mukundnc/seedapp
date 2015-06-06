
var fs = require('fs');
var config = require('./../../config/config');

function DataManager(){

}

DataManager.prototype.saveSalesStrategy = function(req, res){
	var filePath = config.saleStrategy.strategyFileName;
	fs.writeFile(filePath, JSON.stringify(req.body), function(err){
		if(err){
			logger.log(err);
			res.json({success: false, message: 'falied to save the data'})
		}
		else
			res.json({success: true, message: 'data saved successfully'});
	});	
}

module.exports = DataManager;

