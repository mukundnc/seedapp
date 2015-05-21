var QueryParseListenerBase = require('./antlr/generated/salesListener').salesListener;
var ExpressionBuilder = require('./ExpressionBuilder');
var logger = require('./../utils/Logger');
var sc = require('./../../config/config').searchContext;

function QueryParseListener(cbOnExitQuery){
	QueryParseListenerBase.call(this);
	this.cbOnExitQuery = cbOnExitQuery;
	this.memory = {};
	return this;
}

QueryParseListener.prototype = Object.create(QueryParseListenerBase.prototype);
QueryParseListener.constructor = QueryParseListener;

QueryParseListener.prototype.enterQuery = function(ctx){
	this.memory = {};
	logger.log('enter query');
}

QueryParseListener.prototype.exitQuery = function(ctx){
	this.cbOnExitQuery({
		success: true, 
		data : this.memory});
	logger.log('exit query');
}

// Enter a parse tree produced by salesParser#category_in_region.
QueryParseListener.prototype.enterCategory_in_region = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'region', ctx.regionSpec(), sc.category_in_region);
};

// Enter a parse tree produced by salesParser#category_in_state.
QueryParseListener.prototype.enterCategory_in_state = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'state', ctx.stateSpec(), sc.category_in_state);
};

// Enter a parse tree produced by salesParser#category_in_city.
QueryParseListener.prototype.enterCategory_in_city = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'city', ctx.citySpec(), sc.category_in_city);
};

// Enter a parse tree produced by salesParser#type_in_region.
QueryParseListener.prototype.enterType_in_region = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'region', ctx.regionSpec(), sc.type_in_region);
};

// Enter a parse tree produced by salesParser#type_in_state.
QueryParseListener.prototype.enterType_in_state = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'state', ctx.stateSpec(), sc.type_in_state);
};

// Enter a parse tree produced by salesParser#type_in_city.
QueryParseListener.prototype.enterType_in_city = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'city', ctx.citySpec(), sc.type_in_city);
};

// Enter a parse tree produced by salesParser#brand_in_region.
QueryParseListener.prototype.enterBrand_in_region = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'region', ctx.regionSpec(), sc.brand_in_region);
};

// Enter a parse tree produced by salesParser#brand_in_state.
QueryParseListener.prototype.enterBrand_in_state = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'state', ctx.stateSpec(), sc.brand_in_state);
};

// Enter a parse tree produced by salesParser#brand_in_city.
QueryParseListener.prototype.enterBrand_in_city = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'city', ctx.citySpec(), sc.brand_in_city);
};

// Enter a parse tree produced by salesParser#model_in_region.
QueryParseListener.prototype.enterModel_in_region = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'region', ctx.regionSpec(), sc.model_in_region);
};

// Enter a parse tree produced by salesParser#model_in_state.
QueryParseListener.prototype.enterModel_in_state = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'state', ctx.stateSpec(), sc.model_in_state);
};


// Enter a parse tree produced by salesParser#model_in_city.
QueryParseListener.prototype.enterModel_in_city = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'city', ctx.citySpec(), sc.model_in_city);
};

// Enter a parse tree produced by salesParser#single_entity.
QueryParseListener.prototype.enterSingle_entity = function(ctx) {
	if(ctx.categorySpec())
		this.addSingleKeyToMemory('category', ctx.categorySpec(), sc.category);
	
	if(ctx.typeSpec())
		this.addSingleKeyToMemory('type', ctx.typeSpec(), sc.type);

	if(ctx.brandSpec())
		this.addSingleKeyToMemory('brand', ctx.brandSpec(), sc.brand);

	if(ctx.regionSpec())
		this.addSingleKeyToMemory('region', ctx.regionSpec(), sc.region);

	if(ctx.stateSpec())
		this.addSingleKeyToMemory('state', ctx.stateSpec(), sc.state);

	if(ctx.modelSpec())
		this.addSingleKeyToMemory('model', ctx.modelSpec(), sc.model);

	if(ctx.citySpec())
		this.addSingleKeyToMemory('city', ctx.citySpec(), sc.city);
	
};


// Enter a parse tree produced by salesParser#filter_expression.
QueryParseListener.prototype.enterFilter_expression = function(ctx) {
	var expBldr = new ExpressionBuilder();
	this.memory.filters = expBldr.build(ctx.filterSpec());
};

QueryParseListener.prototype.addSingleKeyToMemory = function(key, spec, searchContext){
	this.memory.query = {};
	this.memory.query[key] = spec.getText();
	this.memory.searchContext = searchContext;
}

QueryParseListener.prototype.addDoubleKeysToMemory = function(key1, spec1, key2, spec2, searchContext){
	this.memory.query = {};
	this.memory.query[key1] = spec1.getText();
	this.memory.query[key2] = spec2.getText();
	this.memory.searchContext = searchContext;
}
module.exports = QueryParseListener;
