var dictonary = require('./domainStrings')

function MatchQuery(){
	this.query = {
		index: 'companysales',
		type: 'sales',
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
	this.query.body.query.match[key] = qValue;
}

MatchQuery.prototype.toESQuery = function(){
	return this.query;
}

function MatchQueryWithSingleField(){
	this.query = {
		index: 'companysales',
		type: 'sales',
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
		index: 'companysales',
		type: 'sales',
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

MatchQueryWithAndFilters.prototype.toESQuery = function(){
	return this.query;
}

function MatchQueryWithOrFilters(){
	this.query = {
		index: 'companysales',
		type: 'sales',
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

module.exports = {
	MatchQuery : MatchQuery,
	MatchQueryWithSingleField : MatchQueryWithSingleField,
	MatchQueryWithAndFilters : MatchQueryWithAndFilters,
	MatchQueryWithOrFilters : MatchQueryWithOrFilters
}























