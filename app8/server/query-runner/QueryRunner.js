var _ = require('underscore');
var qb = require('./ESQueryBuilder');
var elasticsearch = require('elasticsearch');
var config = require('./../../config/config');
var QueryAggregator = require('./QueryAggregator');
var CompareQueryAggregator = require('./CompareQueryAggregator');
var logger = require('./../utils/Logger');

function QueryRunner(){
	this.client = new elasticsearch.Client({
		host: config.elasticSearch.url,
		requestTimeout : 1000 * 60 *5
	});
}

QueryRunner.prototype.run = function(antlrQueryObject, cbOnDone){
	function onComplete(data){
		cbOnDone({
			success : data.success,
			results : data.results
		});
	}
	if(this.isCompareSearch(antlrQueryObject)){
		this.runCompare(antlrQueryObject, onComplete)
	}
	else
		this.runSingle(antlrQueryObject, onComplete);
}


QueryRunner.prototype.runSingle = function(antlrQueryObject, cbOnDone){
	var esQuery = this.getESQuery(antlrQueryObject);
	this.applyAggregatorsToESQuery(esQuery, antlrQueryObject);
	logger.log(JSON.stringify(esQuery));
	this.client.search(esQuery, (function(err, res){
		if(err){
			logger.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			this.addValueAggregateToTimeSeries(res);
			cbOnDone({success : true, results : res});
		}
	}).bind(this));	
}

QueryRunner.prototype.runCompare = function(antlrQueryObject, cbOnDone){
	var esQuery = this.getESQueryToCompare(antlrQueryObject);
	this.applyAggregatorsToESQuery(esQuery, antlrQueryObject);
	this.client.search(esQuery, (function(err, res){
		if(err){
			logger.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			res.qSource = antlrQueryObject.product.values;
			res.qTarget = antlrQueryObject.supplier.values;
			this.addValueAggregateToTimeSeries(res);
			cbOnDone({success : true, results : res});
		}
	}).bind(this));	
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

QueryRunner.prototype.applyAggregatorsToESQuery = function(esQuery, antlrQueryObject){
	var agg = this.isCompareSearch(antlrQueryObject) ? new CompareQueryAggregator() : new QueryAggregator();
	esQuery.body.aggs = agg.getAggregates(antlrQueryObject).aggs;	
}

QueryRunner.prototype.addValueAggregateToTimeSeries = function(esResp){
	if(esResp.hits.total === 0 || !esResp.aggregations) return;

	for(var aggKey in esResp.aggregations){
		if(esResp.aggregations[aggKey].buckets && esResp.aggregations[aggKey].buckets.length > 0){
			esResp.aggregations[aggKey].buckets.forEach((function(bucket){
				var rate = bucket.amount.value / bucket.doc_count;
				var tsObject = this.getTimeSeriesObjectFromBucket(bucket);
				if(tsObject && tsObject.buckets && tsObject.buckets.length > 0){
					tsObject.buckets.forEach(function(tsBucket){
						tsBucket.amount = tsBucket.doc_count * rate;
					});
				}
			}).bind(this));
		}
	}
}

QueryRunner.prototype.getTimeSeriesObjectFromBucket = function(bucket){
	var timeKeys = ['yearly', 'monthly', 'daily'];

	for(var key in bucket){
		if(_.contains(timeKeys, key))
			return bucket[key];
	}
}

QueryRunner.prototype.isCompareSearch = function(query){
	return (query.product.values.length > 1 || query.supplier.values.length > 1);
}

QueryRunner.prototype.getESQueryToCompare = function(query){
	var esQuery = new qb.CompareQueryWithTermsAndFilters();
	
	query.product.values.forEach(function(pv){
		esQuery.addTerm(query.product.key, pv);
	});	
	
	query.supplier.values.forEach(function(sv){
		query.product.isPresent ?
					  esQuery.addFilter(query.supplier.key, sv) :
					  esQuery.addTerm(query.supplier.key, sv);
	});
	return esQuery.toESQuery();
}
module.exports = QueryRunner;