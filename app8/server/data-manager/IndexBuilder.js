var elasticsearch = require('elasticsearch');
var request = require('request');
var fs = require('fs');
var config = require('./../../config/config');
var esConfig = config.elasticSearch;
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

IndexBuilder.prototype.build = function(req, res){
	new ProductBuilder().getSalesProducts(this.createIndex.bind(this, res));
	//res.json({success: true, message: 'indices built successfully'});
}

IndexBuilder.prototype.createIndex = function(resHttp, products){
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
		logger.log("deleted indices successfully : " + esConfig.salesIndex);
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
			logger.log('created index successfully');
			this.putMapping(products, resHttp);
		}
	}).bind(this));
}

IndexBuilder.prototype.putMapping = function(products, resHttp){
	var url = esConfig.url + esConfig.salesIndex + '/_mapping/' + esConfig.salesType;
	var mapping = {
		csales : {
			properties : {
				product : {
					properties : {
						line : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						model : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						component : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'}
					}
				},
				supplier : {
					properties: {
						name : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						city : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'},
						country : {'type' : 'string', 'index' : 'not_analyzed', 'store' : 'true'}
					}
				},
				quantity : {'type' : 'integer'},
				rate : {'type' : 'double'},
				amount : {'type' : 'double'},
				date : {'type':'date', 'format':'yyyy/MM/dd HH:mm:ss||yyyy/MM/dd'}
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
			logger.log('error in creating mapping');
			return;
		}
		this.addTypesToIndex(products, resHttp);
	}).bind(this));	
}

IndexBuilder.prototype.addTypesToIndex = function(products, resHttp){
	var self = this;
	var sales20KDoc = [];
	var TWENTY_K = Math.min(20000, products.length);
	var orgCnt = products.length;
	var isResponseSent = false;

	function onComplete(){
		if(!isResponseSent){
			resHttp.json({success: true, message: 'Request added successfully.\nPlease check applogs for status'});
			isResponseSent = true;
		}

		logger.log('create index success count = ' + (orgCnt - products.length));
		if(products.length === 0) {
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
			logger.log(err);
			return;
		}
		cbOnComplete();
	});
}

IndexBuilder.prototype.createCsv = function(products){
	var csvProducts = this.convertToCsvProducts(products);
	var keys = Object.keys(csvProducts[0]);
	var comma = '\",\"';
	var header = '\"';
	keys.forEach(function(k){
		header += k + comma;
	});
	header = header.substr(0, header.length-2);
	header += '\n';
	csvProducts.forEach(function(val){
		var str ='\"';
		keys.forEach(function(k){
			str += val[k] + comma;
		});
		header += str.substr(0, str.length-2);
		header += '\n';
	});
	var csvFilePath = config.saleStrategy.strategyFileName.replace('.txt', '.csv');
	fs.writeFile(csvFilePath, header, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    logger.log("The file was saved - " + csvFilePath);
	}); 
}

IndexBuilder.prototype.convertToCsvProducts = function(products){
	var csv = [];
	products.forEach(function(p){
		csv.push({
			category : p.product.category,
			type : p.product.type,
			brand : p.product.brand,
			model : p.product.model,
			region : p.region.region,
			state : p.region.state,
			city : p.region.city,			
			pincode : p.region.pincode,
			timestamp : p.timestamp,
			name : p.customer.name,
			sex : p.customer.sex,
			email : p.customer.email,
			dob : p.customer.dob
		});
	});
	return csv
}
module.exports = IndexBuilder;