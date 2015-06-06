var logger = require('./../utils/Logger');
var ProductBuilder = require('./ProductBuilder');

function IndexBuilder(){

}

IndexBuilder.prototype.build = function(req, res, saleStrategy){
	var prodBldr = new ProductBuilder();
	var products = prodBldr.getSalesProducts(saleStrategy);
	res.json({success: true, message: 'indices built successfully'});
}


module.exports = IndexBuilder;