var QueryParseListenerBase = require('./antlr/generated/salesListener').salesListener;


function QueryParseListener(){
	QueryParseListenerBase.call(this);
	return this;
}

QueryParseListener.prototype = Object.create(QueryParseListenerBase.prototype);
QueryParseListener.constructor = QueryParseListener;


module.exports = QueryParseListener;
