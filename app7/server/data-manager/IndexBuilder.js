var elasticsearch = require('elasticsearch');
var request = require('request');
var esConfig = require('./../../config/config').elasticSearch;
var logger = require('./../utils/Logger');
var ProductBuilder = require('./ProductBuilder');

function IndexBuilder(){
	this.client = new elasticsearch.Client({
		host: esConfig.url,
		requestTimeout : 1000 * 60 *5
		//,log: 'trace'
	});
	this.id = 1;
}

IndexBuilder.prototype.build = function(req, res, saleStrategy){
	var prodBldr = new ProductBuilder();
	var products = prodBldr.getSalesProducts(saleStrategy);
	if(!products || products.length === 0){
		logger.log('0 products created');
		res.json({success : false, message : '0 products indexed'});
		return;
	}

	this.createIndex(products, res);
	//res.json({success: true, message: 'indices built successfully'});
}

IndexBuilder.prototype.createIndex = function(products, resHttp){
	this.deleteIndex((function(result){
		if(!result){
			res.json({success: false, message: 'failed to delete index'});
			return;
		}

		this.createNewIndexWithMapping(products,resHttp);
	}).bind(this));
}

IndexBuilder.prototype.deleteIndex = function(cbOnDelete){
	var options = {
		index: esConfig.salesIndex,
  		ignore: [404]
	};

	function deleteSuccess(){
		console.log("deleted indices successfully : " + esConfig.salesIndex);
		cbOnDelete(true);
	}

	function deleteError(err){
		cbOnDelete(false);
	}

	this.client.indices.delete(options).then(deleteSuccess, deleteError);
}

IndexBuilder.prototype.createNewIndexWithMapping = function(products, resHttp){
	var options = {
		url : esConfig.url + esConfig.salesIndex,
		method : 'PUT',
	}; 
	request(options, (function(err, req, body){
		if(err){
			resHttp.json({success: false, message: 'error in creating index'});
			return;
		}
		var data = JSON.parse(body);
		if(data.acknowledged){
			console.log('created index successfully');
			this.putMapping(products, resHttp);
		}
	}).bind(this));
}

IndexBuilder.prototype.putMapping = function(products, resHttp){
	var url = esConfig.url + esConfig.salesIndex + '/_mapping/' + esConfig.salesType;
	var mapping = {
		sales : {
			properties : {
				product : {
					properties : {
						id : {'type': 'long'},
						category : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						type : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						brand : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						model : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'}
					}
				},
				customer : {
					properties: {
						id : {'type': 'long'},
						sex : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						email : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						contactNumber : {'type' : 'long'},
						dob : {'type':'date', 'format':'yyyy/MM/dd HH:mm:ss||yyyy/MM/dd'}
					}
				},
				region : {
					properties: {
						id : {'type': 'long'},
						region : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						state : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						city : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						pincode : {'type' : 'long'}						
					}
				},
				timestamp:{'type':'date','format':'yyyy/MM/dd HH:mm:ss||yyyy/MM/dd'}
			}
		}
	};

	var options = {
		url : url,
		method : 'PUT',
		json : mapping
	}; 
	request(options, (function(err, req, body){
		if(err){
			console.log('error in creating mapping');
			return;
		}
		this.addTypesToIndex(products, resHttp);
	}).bind(this));	
}

IndexBuilder.prototype.addTypesToIndex = function(products, resHttp){
	var self = this;
	var sales20KDoc = [];
	var TWENTY_K = 20000;
	var orgCnt = products.length;

	function onComplete(){
		console.log('create index success count = ' + (orgCnt - products.length));
		if(products.length === 0) {
			resHttp.json({success: true, message: 'indices built successfully'});
			return;
		}

		sales20KDoc = [];
		var max = products.length > TWENTY_K ? TWENTY_K : products.length; 
		for (var i = 0; i < max; i++) {
	 		sales20KDoc.push(products.pop());
		};
		self.add20KSalesDoc(sales20KDoc, onComplete);
	}

	for (var i = 0; i < TWENTY_K; i++) {
	 	sales20KDoc.push(products.pop());
	};

	self.add20KSalesDoc(sales20KDoc, onComplete);
}

IndexBuilder.prototype.add20KSalesDoc = function(sales20KDoc, cbOnComplete){
	var self = this;
	var bulkQuery = {body : []};
	sales20KDoc.forEach(function(sDoc){
		bulkQuery.body.push({
			index: {
				_index : esConfig.salesIndex,
				_type : esConfig.salesType,
				_id : self.id
			}
		});

		bulkQuery.body.push(sDoc);
		++self.id;

	});

	this.client.bulk(bulkQuery, function (err, resp) {
		if(err){
			console.log(err);
			return;
		}
		cbOnComplete();
	});
}


module.exports = IndexBuilder;