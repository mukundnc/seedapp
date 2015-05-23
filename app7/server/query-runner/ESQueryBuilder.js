var dictonary = require('./../../config/Dictionary');
var config = require('./../../config/config');

function MatchQuery(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				match: {
				}
			}
		}

	}
}

MatchQuery.prototype.addMatch = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	if(key === 'model'){
		delete this.query.body.query.match;
		this.query.body.query = {
			multi_match : {
				query : qValue,
				fields : ['model', 'city']
			}
		};
	}
	else
		this.query.body.query.match[key] = qValue;
}

MatchQuery.prototype.addDateRange = function(start, end){
	this.query.body.filter = {
		range:{
			timestamp : {
				gte : start,
				lte : end
			}
		}
	};
}

MatchQuery.prototype.toESQuery = function(){
	return this.query;
}

function MatchQueryWithSingleField(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match: {
						}
					},
					filter : {
						term : {

						}
					}

				}		
			}
		}
	};
} 

MatchQueryWithSingleField.prototype.addMatch = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	this.query.body.query.filtered.query.match[key] = qValue;
}

MatchQueryWithSingleField.prototype.addField = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	this.query.body.query.filtered.filter.term[key] = qValue;
}

MatchQueryWithSingleField.prototype.toESQuery = function(){
	return this.query;
}

function MatchQueryWithAndFilters(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match: {
						}
					},
					filter : {
						and : [
						]						
					}
				}		
			}
		}
	}
}

MatchQueryWithAndFilters.prototype.addMatch = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	this.query.body.query.filtered.query.match[key] = qValue;
}

MatchQueryWithAndFilters.prototype.addAndFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.and.push(term);
}

MatchQueryWithAndFilters.prototype.addDateRange = function(start, end){
	var range = {
		range : {
			timestamp : {
				gte : start,
				lte : end
			}
		}
	}
	this.query.body.query.filtered.filter.and.push(range);
}

MatchQueryWithAndFilters.prototype.toESQuery = function(){
	return this.query;
}

function MatchQueryWithOrFilters(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match: {
						}
					},
					filter : {
						or : [
						]
						
					}

				}		
			}
		}
	}
}

MatchQueryWithOrFilters.prototype.addMatch = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	this.query.body.query.filtered.query.match[key] = qValue;
}

MatchQueryWithOrFilters.prototype.addOrFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.or.push(term);
}

MatchQueryWithOrFilters.prototype.toESQuery = function(){
	return this.query;
}




function MatchQueryWithAndOrFilters(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match: {
						}
					},
					filter : {
						and :[
						],
						or : [
						]					
					}
				}		
			}
		}
	}
}

MatchQueryWithAndOrFilters.prototype.addMatch = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	this.query.body.query.filtered.query.match[key] = qValue;
}

MatchQueryWithAndOrFilters.prototype.addOrFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.or.push(term);
}

MatchQueryWithAndOrFilters.prototype.addAndFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.and.push(term);
}

MatchQueryWithAndOrFilters.prototype.toESQuery = function(){
	return this.query;
}

function QueryAggregator(){
	this.aggregatorTemplate = {
		aggs : {
			categories : {
				terms : {
					field : 'category',
					size : 5
				}
			},
			brands:{
				terms : {
					field : 'brand',
					size : 100
				}
			},
			regions: {
				terms : {
					field : 'region',
					size : 5
				}
			},
			types : {
				terms : {
					field : 'type',
					size : 100
				}
			},
			states : {
				terms : {
					field : 'state',
					size : 50

				}
			},
			cities : {
				terms : {
					field : 'city',
					size : 100
				}
			},
			models : {
				terms : {
					field : 'model',
					size : 600
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
	};
}

QueryAggregator.prototype.getDefault = function(){
	var agg = JSON.parse(JSON.stringify(this.aggregatorTemplate));
	return agg;
}

function FilterOnly(){
	this.query = {
		index: config.elasticSearch.salesIndex,
		type: config.elasticSearch.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match_all: {
						}
					},
					filter : {
						and :[
						],
						or : [
						]					
					}
				}		
			}
		}
	}

}

FilterOnly.prototype.addOrFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.or.push(term);
}

FilterOnly.prototype.addAndFilter = function(key, value){
	var qValue = dictonary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.and.push(term);
}

FilterOnly.prototype.addDateRange = function(start, end){
	var range = {
		range : {
			timestamp : {
				gte : start,
				lte : end
			}
		}
	}
	this.query.body.query.filtered.filter.and.push(range);
}

FilterOnly.prototype.toESQuery = function(){
	return this.query;
}

function getRootQuery(){
	return {
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
}

module.exports = {
	getRootQuery : getRootQuery,
	MatchQuery : MatchQuery,
	MatchQueryWithSingleField : MatchQueryWithSingleField,
	MatchQueryWithAndFilters : MatchQueryWithAndFilters,
	MatchQueryWithOrFilters : MatchQueryWithOrFilters,
	MatchQueryWithAndOrFilters : MatchQueryWithAndOrFilters,
	QueryAggregator : QueryAggregator,
	FilterOnly : FilterOnly
}























