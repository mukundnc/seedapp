var qb = require('./ESQueryBuilder');
var elasticsearch = require('elasticsearch');
var config = require('./../../config/config');

function QueryRunner(){
	this.client = new elasticsearch.Client({
		host: config.elasticSearch.url,
		requestTimeout : 1000 * 60 *5
	});
}

QueryRunner.prototype.run = function(antlrQueryObject, cbOnDone){
	var esQuery = this.getESQuery(antlrQueryObject);
	console.log(JSON.stringify(esQuery));
	this.client.search(esQuery, function(err, res){
		if(err){
			logger.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			cbOnDone({success : true, results : res});
		}
	});	
}

QueryRunner.prototype.getESQuery = function(query){
	var esQuery = new qb.MatchAllWithMultiAndFiltersQuery();
	if(query.product.isPresent){
		query.product.values.forEach(function(v){
			esQuery.addFilter(query.product.key, v);
		});
	}
	if(query.supplier.isPresent){
		query.supplier.values.forEach(function(v){
			esQuery.addFilter(query.supplier.key, v);
		});
	}
	if(query.time.isPresent){
		var start = query.time.values[0].filter.value;
		var end = query.time.values[1].filter.value;
		esQuery.addDateRange(start, end);
	}
	return esQuery.toESQuery();
}

module.exports = QueryRunner;