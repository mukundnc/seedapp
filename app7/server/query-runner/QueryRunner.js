var elasticsearch = require('elasticsearch');
var dictonary = require('./../../config/Dictionary');
var qb = require('./QueryBuilder');
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


QueryRunner.prototype.run = function(antlrQueryObject, cbOnDone){
	var esQuery = this.getESQueryFromQueryAndFilters(antlrQueryObject);
	this.applyAggregatorsToESQuery(esQuery, antlrQueryObject);
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

QueryRunner.prototype.getESQueryFromQueryAndFilters = function(queryAndFilters){
	var esQuery = {};
	if(queryAndFilters.filters){
		esQuery = this.getMultiFieldAndOrESQuery(queryAndFilters);
	}
	else{
		esQuery = this.getMatchOrSingleFieldESQuery(queryAndFilters);		
	}
	return esQuery;
}

QueryRunner.prototype.getMatchOrSingleFieldESQuery = function(queryAndFilters){
	var esQuery = {};
	var qKeys = Object.keys(queryAndFilters.query);
	var dateRange = dtm.getDateRangeFromFilters(queryAndFilters);
	if(qKeys.length === 1){                        //Keyword query like 'show all apple'
		var aQuery = new qb.MatchQuery();
		aQuery.addMatch(qKeys[0], queryAndFilters.query[qKeys[0]]);		
		if(dateRange.hasDates)
			aQuery.addDateRange(dateRange.startDate, dateRange.endDate);
		esQuery = aQuery.toESQuery();
	}
	if(qKeys.length === 2){                        //Keyword with single match like 'show all apple in maharashtra'
		if(!dateRange.hasDates){
			var aQuery = new qb.MatchQueryWithSingleField();
			aQuery.addMatch(qKeys[0], queryAndFilters.query[qKeys[0]]);
			aQuery.addField(qKeys[1], queryAndFilters.query[qKeys[1]]);
			esQuery = aQuery.toESQuery();
		}
		else{
			var aQuery = new qb.MatchQueryWithAndFilters();
			aQuery.addMatch(qKeys[0], queryAndFilters.query[qKeys[0]]);
			aQuery.addAndFilter(qKeys[1], queryAndFilters.query[qKeys[1]]);
			aQuery.addDateRange(dateRange.startDate, dateRange.endDate);
			esQuery = aQuery.toESQuery();
		}
	}	
	return esQuery;
}


QueryRunner.prototype.getMultiFieldAndOrESQuery = function(queryAndFilters){
	var hasAndOnlyFilters = queryAndFilters.filters.and.length > 0 && queryAndFilters.filters.or.length === 0;
	var hasOrOnlyFilters = queryAndFilters.filters.or.length > 0 && queryAndFilters.filters.and.length === 0;
	var hasBothAndOrFilters = queryAndFilters.filters.or.length > 0 && queryAndFilters.filters.and.length > 0;

	if(hasAndOnlyFilters)
		return this.getMultiAndOnlyESQuery(queryAndFilters);

	if(hasOrOnlyFilters)
		return this.getMultiAndOrESQuery(queryAndFilters);

	if(hasBothAndOrFilters)
		return this.getMultiAndOrESQuery(queryAndFilters);
}

QueryRunner.prototype.getMultiAndOnlyESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(k1,v1);

	if(qKeys.length > 1){ 				//this has become optional now as we support single entity key search
		var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
		esQuery.addAndFilter(k2,v2);
	}

	queryAndFilters.filters.and.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addAndFilter(filter.filter.name, filter.filter.value)
		}
	});

	var dateRange = dtm.getDateRangeFromFilters(queryAndFilters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);

	return esQuery.toESQuery();
}

QueryRunner.prototype.getMultiOrOnlyESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(k1,v1);

	if(qKeys.length > 1){ 				//this has become optional now as we support single entity key search
		var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
		esQuery.addAndFilter(k2,v2);
	}

	queryAndFilters.filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	return esQuery.toESQuery();
}

QueryRunner.prototype.getMultiAndOrESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(k1,v1);

	if(qKeys.length > 1){ 				//this has become optional now as we support single entity key search
		var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
		esQuery.addAndFilter(k2,v2);
	}

	queryAndFilters.filters.and.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addAndFilter(filter.filter.name, filter.filter.value)
		}
	});

	queryAndFilters.filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	return esQuery.toESQuery();
}

QueryRunner.prototype.applyAggregatorsToESQuery = function(esQuery, queryAndFilters){
	var agg = new qb.QueryAggregator().getDefault();
	var sc = config.searchContext;

	switch(queryAndFilters.searchContext){
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
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.type_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.type_in_city : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand_in_region : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand_in_city : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
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
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.model_in_state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
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
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.type : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.brand : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.region : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.state : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.model : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		case sc.city : 
			delete agg.aggs.categories;
			delete agg.aggs.types;
			delete agg.aggs.brands;
			delete agg.aggs.models;
			delete agg.aggs.regions;
			delete agg.aggs.states;
			delete agg.aggs.cities;
			break;
		default : 
			logger.log('********  invalid search context in aggregator *********');
	}
}


module.exports = QueryRunner;
