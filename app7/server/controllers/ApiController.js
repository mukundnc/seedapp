function ApiController(){

}

ApiController.prototype.handleDefaultRequest = function(req, res){
	res.send('welcome to search api.')
}

ApiController.prototype.handleSearchRequest = function(req, res){
	res.json({sucess: true, data : {}});
}


var gApiController = new ApiController();

module.exports = gApiController;