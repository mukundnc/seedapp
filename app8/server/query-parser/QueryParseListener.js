var _ = require('underscore');
var QueryParseListenerBase = require('./antlr/generated/salesListener').salesListener;
var ExpressionBuilder = require('./ExpressionBuilder');
var logger = require('./../utils/Logger');
var sc = require('./../../config/config').searchContext;
var allRegions = require('./../data-manager/Regions');
var dict = require('./../../config/Dictionary');
var utils = require('./../utils/Utils');
function QueryParseListener(cbOnExitQuery){
	QueryParseListenerBase.call(this);
	this.cbOnExitQuery = cbOnExitQuery;
	this.memory = [];
	this.timeFilters = null;
	return this;
}

QueryParseListener.prototype = Object.create(QueryParseListenerBase.prototype);
QueryParseListener.constructor = QueryParseListener;

QueryParseListener.prototype.enterQuery = function(ctx){
	this.memory = [];
	this.timeFilters = null;
	logger.log('enter query');
}

QueryParseListener.prototype.exitQuery = function(ctx){
	this.cbOnExitQuery({
		success: true, 
		data : this.getParsedQueryFromMemory()
	});
	//console.log(JSON.stringify(this.memory));
	logger.log('exit query');
}

// Enter a parse tree produced by salesParser#product_spec.
QueryParseListener.prototype.enterProduct_spec = function(ctx) {
	var key = '';
	var spec = null;
	if(ctx.lineSpec().length > 0){
		key = 'line';
		spec = ctx.lineSpec();
	}
	else if(ctx.modelSpec().length > 0){
		key = 'model';
		spec = ctx.modelSpec();
	}
	else if(ctx.componentSpec().length > 0){
		key = 'component';
		spec = ctx.componentSpec();
	}
	this.addKeySpecToMemory(key, spec);
};

// Enter a parse tree produced by salesParser#supplier_spec.
QueryParseListener.prototype.enterSupplier_spec = function(ctx) {
	var key = '';
	var spec = null;
	if(ctx.supplierNameSpec().length > 0){
		key = 'supplier';
		spec = ctx.supplierNameSpec();
	}
	else if(ctx.supplierCitySpec().length > 0){
		key = 'city';
		spec = ctx.supplierCitySpec();
	}
	else if(ctx.supplierCountrySpec().length > 0){
		key = 'country';
		spec = ctx.supplierCountrySpec();
	}
	this.addKeySpecToMemory(key, spec);
};

// Enter a parse tree produced by salesParser#part_spec.
QueryParseListener.prototype.enterPart_spec = function(ctx) {
	this.addKeyStringToMemory('part', ctx.PART().getText());
};

// Enter a parse tree produced by salesParser#spend_spec.
QueryParseListener.prototype.enterSpend_spec = function(ctx) {
	this.addKeyStringToMemory('spend', ctx.SPEND().getText());
};

// Enter a parse tree produced by salesParser#average_spec.
QueryParseListener.prototype.enterAverage_spec = function(ctx) {
	this.addKeyStringToMemory('average', ctx.AVERAGE().getText());
};

// Enter a parse tree produced by salesParser#time_spec.
QueryParseListener.prototype.enterTime_spec = function(ctx) {
	this.timeFilters = new ExpressionBuilder().build(ctx);
};

// Enter a parse tree produced by salesParser#by_time_spec.
QueryParseListener.prototype.enterBy_time_spec = function(ctx) {
	var str = ctx.BY_MONTH() ? 'month' : 'year';
	this.addKeyStringToMemory('bytime', str);
};

QueryParseListener.prototype.addKeySpecToMemory = function(key, spec){
	var entry = {
		key : key,
		values : [],
		isObject : true
	};

	spec.forEach(function(s){
		entry.values.push(s.getText());
	});

	this.memory.push(entry);
}

QueryParseListener.prototype.addKeyStringToMemory = function(key, strVal){
	this.memory.push({
		key : key,
		values : [strVal],
		isObject : false
	})
}

QueryParseListener.prototype.getParsedQueryFromMemory = function(){
	var query = {
		product : {isPresent: false, key : null, values : []},
		supplier : {isPresent: false, key : null, values : []},
		part : {isPresent: false},
		spend : {isPresent: false},
		average : {isPresent: false, bytime: null},
		time : {isPresent: false},
		context : 0
	};

	this.memory.forEach(function(entry){
		if(utils.isProductType(entry.key)){
			query.product.isPresent = true;
			query.product.key = entry.key;
			query.product.values = entry.values;
		}
		if(utils.isSupplierType(entry.key)){
			query.supplier.isPresent = true;
			query.supplier.key = entry.key;
			query.supplier.values = entry.values;
		}
		if(entry.key === 'part')
			query.part.isPresent = true;
		if(entry.key === 'spend')
			query.spend.isPresent = true;
		if(entry.key === 'average')
			query.average.isPresent = true;
		if(entry.key === 'bytime')
			query.average.bytime = entry.values[0];
	});
	query.part.isPresent = !query.spend.isPresent;
	
	if(this.timeFilters){
		query.time.isPresent = true;
		query.time.values = this.timeFilters;
	}

	query.context = this.getQueryContext(query.product.key, query.supplier.key, query.part.isPresent,
		                                 query.spend.isPresent, query.average.isPresent);
	
	return query;
}

QueryParseListener.prototype.getQueryContext = function(prodKey, suppKey, part, spend, average){
	var strCtx = '';

	if(prodKey) 
		strCtx += ('_' + prodKey);
	if(suppKey) {
		if(prodKey)
			strCtx += ('_from_' + suppKey);
		else
			strCtx += ('_' + suppKey);
	}
	
	if(spend) strCtx += '_spend';
	
	if(average) strCtx += '_average';

	strCtx = strCtx.substr(1, strCtx.length);

	return sc[strCtx];
}

module.exports = QueryParseListener;