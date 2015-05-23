var elasticsearch = require('elasticsearch');
var dictonary = require('./../../config/Dictionary');
var ESQueryHelper = require('./ESQueryHelper');
var qb = require('./ESQueryBuilder');
var dtm = require('./../utils/DateTime');
var config = require('./../../config/config');
var logger = require('./../utils/Logger');


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
	var esQuery = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				match_all: {
				}
			},
			aggs:{
				categories : {
					terms : {
						field : 'category',
						size : 5
					}
				},
				regions: {
					terms : {
						field : 'region',
						size : 5
					}
				},
				yearly : {
					date_histogram : {
						field : 'timestamp',
						interval : 'year',
						format : 'YYYY/MM/DD'
					}
				}
			}			
		}
	};
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
	var execCnt = 0;

	function onComplete(data){
		execCnt++;
		resp.results.push(data.results);
		if(execCnt >= allSrcTargets.length){
			cbOnDone(resp);
			return;
		}
	}

	allSrcTargets.forEach((function(st){
		this.runSingle(st, antlrQueryObject.searchContext, onComplete);
	}).bind(this));
}

QueryRunner.prototype.runSingle = function(srcTargetFilter, searchContext, cbOnDone){
	var qHlpr = new ESQueryHelper();
	var esQuery = qHlpr.getESQuery(srcTargetFilter.source, srcTargetFilter.target, srcTargetFilter.filters);
	this.applyAggregatorsToESQuery(esQuery, searchContext);
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


QueryRunner.prototype.applyAggregatorsToESQuery = function(esQuery, searchContext){
	var agg = new qb.QueryAggregator().getDefault();
	var sc = config.searchContext;

	switch(searchContext){
		case sc.category_in_region : 
			delete agg.aggs.categories;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.cities;
			break;
		case sc.category_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			break;
		case sc.category_in_city : 
			delete agg.aggs.categories;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.type_in_region : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.cities;
			delete agg.aggs.regions;
			break;
		case sc.type_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			break;
		case sc.type_in_city : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand_in_region : 
			delete agg.aggs.brands;
			delete agg.aggs.regions;
			delete agg.aggs.cities;
			delete agg.aggs.models;
			break;
		case sc.brand_in_state : 
			delete agg.aggs.brands;
			delete agg.aggs.regions;
			delete agg.aggs.cities;
			delete agg.aggs.states;
			break;
		case sc.brand_in_city : 
			delete agg.aggs.brands;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.model_in_region : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.cities;
			break;
		case sc.model_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			break;
		case sc.model_in_city : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.category : 
			delete agg.aggs.categories;
			delete agg.aggs.models;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.type : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.models;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand : 
			delete agg.aggs.brands;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.region : 
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.cities;
			break;
		case sc.state : 
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			break;
		case sc.model : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.city : 
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		default : 
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.states;
			delete agg.aggs.cities;
	}

	esQuery.body.aggs = agg.aggs;
}


module.exports = QueryRunner;















