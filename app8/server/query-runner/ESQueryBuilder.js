var esConfig = require('./../../config/config').elasticSearch;
var dictionary = require('./../../config/Dictionary');

function MatchAllWithMultiAndFiltersQuery(){
	this.query = {
		index: esConfig.salesIndex,
		type: esConfig.salesType,
		body: {
			query: {
				filtered: {
					query :{
						match_all: {
						}
					},
					filter : {
						and : []
					}
				}		
			}
		}
	};
}

MatchAllWithMultiAndFiltersQuery.prototype.addFilter = function(key, value){
	var qValue = dictionary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.and.push(term);
}

MatchAllWithMultiAndFiltersQuery.prototype.addDateRange = function(start, end){
	var range = {
		range : {
			date : {
				gte : start,
				lte : end
			}
		}
	}
	this.query.body.query.filtered.filter.and.push(range);
}

MatchAllWithMultiAndFiltersQuery.prototype.toESQuery = function(){
	return this.query;
}


function CompareQueryWithTermsAndFilters(){
	this.query = {
		index: esConfig.salesIndex,
		type: esConfig.salesType,
		body: {
			query: {
				filtered: {
					query :{
						bool : {
							should : {
								terms : {
								}
							}
						}
					},
					filter : {
						or : []
					}

				}		
			}
		}
	}
}

CompareQueryWithTermsAndFilters.prototype.addTerm = function(key, value){
	var qValue = dictionary.getDomainQualifiedStr(value);
	if(!this.query.body.query.filtered.query.bool.should.terms[key])
		this.query.body.query.filtered.query.bool.should.terms[key] = [];
	this.query.body.query.filtered.query.bool.should.terms[key].push(qValue);
}

CompareQueryWithTermsAndFilters.prototype.addFilter = function(key, value){
	var qValue = dictionary.getDomainQualifiedStr(value);
	var term = {term: {}};
	term.term[key] = qValue;
	this.query.body.query.filtered.filter.or.push(term);
}

CompareQueryWithTermsAndFilters.prototype.toESQuery = function(){
	if(this.query.body.query.filtered.filter.or.length === 0)
		delete this.query.body.query.filtered.filter;
	return this.query;
}


module.exports = {
	MatchAllWithMultiAndFiltersQuery : MatchAllWithMultiAndFiltersQuery,
	CompareQueryWithTermsAndFilters : CompareQueryWithTermsAndFilters
};