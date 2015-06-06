function IndexBuilder(){

}

IndexBuilder.prototype.build = function(req, res, saleStrategy){
	res.json({success: true, message: 'indices built successfully'});
}

module.exports = IndexBuilder;