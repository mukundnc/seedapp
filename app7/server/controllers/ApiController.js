var logger = require('./../utils/Logger');

function ApiController(){

}

ApiController.prototype.handleDefaultRequest = function(req, res){
	logger.log('inside default request');
	res.send('welcome to search api.')
}

ApiController.prototype.handleSearchRequest = function(req, res){
	logger.log('inside search request');
	res.json({sucess: true, data : {}});
}


var gApiController = new ApiController();

module.exports = gApiController;