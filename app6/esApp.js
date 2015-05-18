var elasticsearch = require('elasticsearch');
var dictonary = require('./domainStrings');
var qb = require('./queryBuilder');
var dtm = require('./dateTime');

function ESApp(){
	this.init();
	this.esUrl = 'http://localhost:9200/companysales/sales';
}

ESApp.prototype.init = function(){
	this.client = new elasticsearch.Client({
		host: 'localhost:9200',
		requestTimeout : 1000 * 60 *5
		//,log: 'trace'
	});
}


ESApp.prototype.executeQuery = function(antlrQueryObject, cbOnDone){
	var esQuery = this.getESQueryFromQueryAndFilters(antlrQueryObject);
	console.log(JSON.stringify(esQuery));
	this.client.search(esQuery, function(err, res){
		if(err){
			console.log(err);
			cbOnDone({success : false, results : 'error in ES query execute'});
		}
		else{
			cbOnDone({success : true, results : res});
		}
	});
	
}

ESApp.prototype.getESQueryFromQueryAndFilters = function(queryAndFilters){
	var esQuery = {};
	if(queryAndFilters.filters){
		esQuery = this.getMultiFieldAndOrESQuery(queryAndFilters);
	}
	else{
		esQuery = this.getMatchOrSingleFieldESQuery(queryAndFilters);		
	}
	return esQuery;
}

ESApp.prototype.getMatchOrSingleFieldESQuery = function(queryAndFilters){
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


ESApp.prototype.getMultiFieldAndOrESQuery = function(queryAndFilters){
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

ESApp.prototype.getMultiAndOnlyESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(k1,v1);
	esQuery.addAndFilter(k2,v2);

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

ESApp.prototype.getMultiOrOnlyESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
	var esQuery = new qb.MatchQueryWithOrFilters();
	esQuery.addMatch(k1,v1);
	esQuery.addOrFilter(k2,v2);

	queryAndFilters.filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	return esQuery.toESQuery();
}

ESApp.prototype.getMultiAndOrESQuery = function(queryAndFilters){
	var qKeys = Object.keys(queryAndFilters.query);
	var k1 = qKeys[0], v1 = queryAndFilters.query[k1];
	var k2 = qKeys[1], v2 = queryAndFilters.query[k2];
	var esQuery = new qb.MatchQueryWithAndOrFilters();
	esQuery.addMatch(k1,v1);
	esQuery.addAndFilter(k2,v2);

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

var gESApp = new ESApp();
module.exports = gESApp;