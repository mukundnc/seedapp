
var fs = require('fs');
var config = require('./../../config/config');
var IndexBuilder = require('./IndexBuilder');

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

DataManager.prototype.buildSalesIndices = function(req, res){
	fs.readFile(config.saleStrategy.strategyFileName, (function(err, data){
		if(err){
			res.json({success : false, message : 'error in reading staregy file'});
			return;
		}

		try{
			var saleStrategy = JSON.parse(data);
			var indexBldr = new IndexBuilder();
			indexBldr.build(req, res, saleStrategy);

		}
		catch(e){
			res.json({success : false, message : 'error in reading staregy data object'});
			return;
		}
	}).bind(this));
}

module.exports = DataManager;

