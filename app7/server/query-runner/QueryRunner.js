var elasticsearch = require('elasticsearch');
var dictonary = require('./../../config/Dictionary');
var ESQueryHelper = require('./ESQueryHelper');
var qb = require('./ESQueryBuilder');
var dtm = require('./../utils/DateTime');
var config = require('./../../config/config');
var logger = require('./../utils/Logger');
var QueryAggregator = require('./QueryAggregator');
var CompareQueryAggregator = require('./CompareQueryAggregator');
var _ = require('underscore');

function QueryRunner(){
	this.init();
}

QueryRunner.prototype.init = function(){
	this.client = new elasticsearch.Client({
		host: config.elasticSearch.url,
		requestTimeout : 1000 * 60 *5
	});
}

QueryRunner.prototype.getRoot = function(cbOnDone){
	var esQuery = qb.getRootQuery();
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

QueryRunner.prototype.run = function(antlrQueryObject, cbOnDone){
	var allSrcTargets = this.getSourceTargetAndFilterBreakDown(antlrQueryObject);
	var resp = {success: true, results : []};

	function onComplete(data){
		resp.results.push(data.results);
		cbOnDone(resp);
		return;
	}

	if(allSrcTargets.length > 1){
		this.runCompare(allSrcTargets, antlrQueryObject, onComplete)
	}
	else
		this.runSingle(allSrcTargets[0], antlrQueryObject, onComplete);
}

QueryRunner.prototype.runSingle = function(srcTargetFilter, antlrQueryObject, cbOnDone){
	var qHlpr = new ESQueryHelper();
	var esQuery = antlrQueryObject.searchContext === config.searchContext.type_in_brand ?
				  qHlpr.getESQueryForTypeInBrand(srcTargetFilter.source, srcTargetFilter.target, srcTargetFilter.filters):
				  qHlpr.getESQuery(srcTargetFilter.source, srcTargetFilter.target, srcTargetFilter.filters);
	this.applyAggregatorsToESQuery(esQuery, antlrQueryObject);
	this.client.search(esQuery, function(err, res){
		if(err){
			logger.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			if(antlrQueryObject.searchContext === config.searchContext.type_in_brand){
				res.qSource = srcTargetFilter.target;
				res.qTarget = null;
			}
			else{
				res.qSource = srcTargetFilter.source;
				res.qTarget = srcTargetFilter.target;
			}
			cbOnDone({success : true, results : res});
		}
	});	
}

QueryRunner.prototype.runCompare = function(allSrcTargetFilters, antlrQueryObject, cbOnDone){
	var qHlpr = new ESQueryHelper();
	var esQuery = qHlpr.getESQueryToCompare(allSrcTargetFilters);
	this.applyAggregatorsToESQuery(esQuery, antlrQueryObject);
	this.client.search(esQuery, function(err, res){
		if(err){
			logger.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			var sources = [];
			var targets = []
			res.qSource = [];
			res.qTarget = [];
			allSrcTargetFilters.forEach(function(stf){
				if(stf.source && !_.contains(sources, stf.source.value)){
					res.qSource.push(stf.source);
					sources.push(stf.source.value);
				}
				if(stf.target && !_.contains(targets, stf.target.value)){
					res.qTarget.push(stf.target);
					targets.push(stf.target.value);
				}
			});
			cbOnDone({success : true, results : res});
		}
	});	
}


QueryRunner.prototype.getSourceTargetAndFilterBreakDown = function(queryAndFilters){
	var arr = [];
	if(queryAndFilters.query){
		var keys = Object.keys(queryAndFilters.query);
		if(keys.length === 1){								//Single entity search : phones
			var vals = queryAndFilters.query[keys[0]];
			vals.forEach(function(v){
				arr.push({
					source :{
						key : keys[0],
						value : v
					}, 
					target : null, 
					filters : queryAndFilters.filters
				});
			});
		}
		if(keys.length === 2){								//Entity in entity search : phones in maharashtra
			var srcObjs = [];
			var srcVals = queryAndFilters.query[keys[0]];
			srcVals.forEach(function(v){
				srcObjs.push({
					key : keys[0],
					value : v
				});
			});
			var trgObjs = [];
			var trgVals = queryAndFilters.query[keys[1]];
			trgVals.forEach(function(v){
				trgObjs.push({
					key : keys[1],
					value : v
				});
			});

			srcObjs.forEach(function(s){
				trgObjs.forEach(function(t){
					arr.push({
						source : s, 
						target : t, 
						filters : queryAndFilters.filters
					});
				});
			});
		}
	}
	else
		arr.push({source : null, target : null, filters : queryAndFilters.filters});

	return arr;
}


QueryRunner.prototype.applyAggregatorsToESQuery = function(esQuery, antlrQueryObject){
	var keys = Object.keys(antlrQueryObject.query);
	var isCompare = false;
	for(var i = 0 ; i < keys.length ; i++){
		var vals = antlrQueryObject.query[keys[i]];
		if(vals.length > 1){
			isCompare = true;
			break;
		}
	}	
	var agg = null;
	agg = isCompare ? new CompareQueryAggregator() : new QueryAggregator();
	esQuery.body.aggs = agg.getAggregates(antlrQueryObject).aggs;	
}


module.exports = QueryRunner;















