var dictonary = require('./../../config/Dictionary');
var qb = require('./ESQueryBuilder');
var dtm = require('./../utils/DateTime');
var config = require('./../../config/config');
var logger = require('./../utils/Logger');
var _ = require('underscore');

function ESQueryHelper(){
	this.queryType = {
		source_only : 1,
		source_target_only : 2,
		source_target_with_filters : 3,
		source_with_filters : 4,
		filters_only : 5
	}
}

ESQueryHelper.prototype.getESQuery = function(source, target, filters){
	var queryType = this.getESQueryType(source, target, filters);
	var esQuery = {};

	switch(queryType){
		case this.queryType.source_only :
			 esQuery = this.getSourceOnly(source);
			 break;
		case this.queryType.source_target_only :
			 esQuery = this.getSourceTargetOnly(source, target);
			 break;
		case this.queryType.source_target_with_filters : 
			 esQuery = this.getSourceTargetAndFilters (source, target, filters);
			 break;
		case this.queryType.source_with_filters : 
			 esQuery = this.getSourceWithFilters(source, filters);
			 break;
		case this.queryType.filters_only : 
			 esQuery = this.getFiltersOnly(filters);
			 break;
		default: logger.log('ESQueryHelper invalid query type');
	}

	return esQuery;
}

ESQueryHelper.prototype.getESQueryType = function(source, target, filters){
	if(!target && !filters) return this.queryType.source_only;

	if(source && target && !filters) return this.queryType.source_target_only;

	if(source && target && filters && (filters.and.length > 0 || filters.or.length > 0)) return this.queryType.source_target_with_filters;

	if(source && !target && filters && (filters.and.length > 0 || filters.or.length > 0))	return this.queryType.source_with_filters;

	if(!source && !target && filters && (filters.and.length > 0 || filters.or.length > 0))	return this.queryType.filters_only;
}

ESQueryHelper.prototype.getSourceOnly = function(source){
	var esQuery = new qb.MatchQuery();
	esQuery.addMatch(source.key, source.value);		
	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getSourceTargetOnly = function(source, target){
	var esQuery = new qb.MatchQueryWithSingleField();
	esQuery.addMatch(source.key, source.value);	
	esQuery.addField(target.key, target.value);		
	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getSourceTargetAndFilters = function(source, target, filters){
	var hasAndOnlyFilters = filters.and.length > 0 && filters.or.length === 0;
	var hasOrOnlyFilters = filters.or.length > 0 && filters.and.length === 0;
	var hasBothAndOrFilters = filters.or.length > 0 && filters.and.length > 0;

	if(hasAndOnlyFilters)
		return this.getMultiAndOnly(source, target, filters);

	if(hasOrOnlyFilters)
		return this.getMultiOrOnly(source, target, filters);

	if(hasBothAndOrFilters)
		return this.getMultiAndOr(source, target, filters);

}

ESQueryHelper.prototype.getSourceWithFilters = function(source, filters){
	return this.getSourceTargetAndFilters(source, null, filters);
}

ESQueryHelper.prototype.getFiltersOnly = function(filters){
	var esQuery = new qb.FilterOnly();
	filters.and.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addAndFilter(filter.filter.name, filter.filter.value)
		}
	});

	filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	var dateRange = dtm.getDateRangeFromFilters(filters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);

	return esQuery.toESQuery();

}

ESQueryHelper.prototype.getMultiAndOnly = function(source, target, filters){
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(source.key, source.value);

	if(target) 									//this has become optional now as we support single entity key search
		esQuery.addAndFilter(target.key, target.value);

	filters.and.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addAndFilter(filter.filter.name, filter.filter.value)
		}
	});

	var dateRange = dtm.getDateRangeFromFilters(filters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);

	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getMultiOrOnly = function(source, target, filters){
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(source.key, source.value);

	if(target) 									//this has become optional now as we support single entity key search
		esQuery.addAndFilter(target.key, target.value);

	filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	var dateRange = dtm.getDateRangeFromFilters(filters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);

	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getMultiAndOr = function(source, target, filters){
	var esQuery = new qb.MatchQueryWithAndFilters();
	esQuery.addMatch(source.key, source.value);

	if(target) 									//this has become optional now as we support single entity key search
		esQuery.addAndFilter(target.key, target.value);

	filters.and.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addAndFilter(filter.filter.name, filter.filter.value)
		}
	});


	filters.or.forEach(function(filter){
		if(!filter.filter.isDate){
			esQuery.addOrFilter(filter.filter.name, filter.filter.value)
		}
	});

	var dateRange = dtm.getDateRangeFromFilters(filters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);

	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getESQueryToCompare = function(allSrcTargetFilters){
	var esQuery = new qb.CompareQueryWithTermsAndFilters();
	var sources = [];
	var targets = [];

	allSrcTargetFilters.forEach(function(stf){
		if(stf.source && !_.contains(sources, stf.source.value)){
			esQuery.addTerm(stf.source.key, stf.source.value);
			sources.push(stf.source.value);
		}
		if(stf.target && !_.contains(targets, stf.target.value)){
			esQuery.addFilter(stf.target.key, stf.target.value);
			targets.push(stf.target.value);
		}
	});
	return esQuery.toESQuery();
}

ESQueryHelper.prototype.getESQueryForTypeInBrand = function(brand, type, filters){
	var esQuery = new qb.MatchAllWithMultiAndFiltersQuery();
	esQuery.addFilter(brand.key, brand.value);
	esQuery.addFilter(type.key, type.value);
	var dateRange = dtm.getDateRangeFromFilters(filters);
	if(dateRange.hasDates)
		esQuery.addDateRange(dateRange.startDate, dateRange.endDate);
	return esQuery.toESQuery();
}
module.exports = ESQueryHelper;
