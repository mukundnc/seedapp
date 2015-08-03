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
			timestamp : {
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

module.exports = {
	MatchAllWithMultiAndFiltersQuery : MatchAllWithMultiAndFiltersQuery
};