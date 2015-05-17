var antlr4 = require('antlr4/index');
var QueryListenerBase = require('./salesListener').salesListener;
var fs = require('fs');

function QueryListener(cbOnExitQuery){
	QueryListenerBase.call(this);
	this.cbOnExitQuery = cbOnExitQuery;
	this.memory = {};
	return this;
}

QueryListener.prototype = Object.create(QueryListenerBase.prototype);
QueryListener.prototype.constructor = QueryListener;

QueryListener.prototype.enterQuery = function(ctx){
	this.memory = {};
}

QueryListener.prototype.exitQuery = function(ctx){
	this.cbOnExitQuery(this.memory);
console.log('exit query');
}

// Enter a parse tree produced by salesParser#category_in_region.
QueryListener.prototype.enterCategory_in_region = function(ctx) {
	this.addDoubleKeyToMemory('category', ctx.categorySpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#category_in_state.
QueryListener.prototype.enterCategory_in_state = function(ctx) {
	this.addDoubleKeyToMemory('category', ctx.categorySpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#category_in_city.
QueryListener.prototype.enterCategory_in_city = function(ctx) {
	this.addDoubleKeyToMemory('category', ctx.categorySpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#type_in_region.
QueryListener.prototype.enterType_in_region = function(ctx) {
	this.addDoubleKeyToMemory('type', ctx.typeSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#type_in_state.
QueryListener.prototype.enterType_in_state = function(ctx) {
	this.addDoubleKeyToMemory('type', ctx.typeSpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#type_in_city.
QueryListener.prototype.enterType_in_city = function(ctx) {
	this.addDoubleKeyToMemory('type', ctx.typeSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#brand_in_region.
QueryListener.prototype.enterBrand_in_region = function(ctx) {
	this.addDoubleKeyToMemory('brand', ctx.brandSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#brand_in_state.
QueryListener.prototype.enterBrand_in_state = function(ctx) {
	this.addDoubleKeyToMemory('brand', ctx.brandSpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#brand_in_city.
QueryListener.prototype.enterBrand_in_city = function(ctx) {
	this.addDoubleKeyToMemory('brand', ctx.brandSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#model_in_region.
QueryListener.prototype.enterModel_in_region = function(ctx) {
	this.addDoubleKeyToMemory('model', ctx.modelSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#model_in_state.
QueryListener.prototype.enterModel_in_state = function(ctx) {
	this.addDoubleKeyToMemory('model', ctx.modelSpec(), 'state', ctx.stateSpec());
};


// Enter a parse tree produced by salesParser#model_in_city.
QueryListener.prototype.enterModel_in_city = function(ctx) {
	this.addDoubleKeyToMemory('model', ctx.modelSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#categorySpec.
QueryListener.prototype.enterCategorySpec = function(ctx) {
	this.addSingleKeyToMemory('category', ctx.categorySpec());
};

// Enter a parse tree produced by salesParser#regionSpec.
QueryListener.prototype.enterRegionSpec = function(ctx) {
	this.addSingleKeyToMemory('region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#stateSpec.
QueryListener.prototype.enterStateSpec = function(ctx) {
	this.addSingleKeyToMemory('state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#typeSpec.
QueryListener.prototype.enterTypeSpec = function(ctx) {
	this.addSingleKeyToMemory('type', ctx.typeSpec());
};

// Enter a parse tree produced by salesParser#brandSpec.
QueryListener.prototype.enterBrandSpec = function(ctx) {
	this.addSingleKeyToMemory('brand', ctx.brandSpec());
};

// Enter a parse tree produced by salesParser#modelSpec.
QueryListener.prototype.enterModelSpec = function(ctx) {
	this.addSingleKeyToMemory('model', ctx.modelSpec());
};

// Exit a parse tree produced by salesParser#citySpec.
QueryListener.prototype.enterCitySpec = function(ctx) {
	this.addSingleKeyToMemory('city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#filter_expression.
QueryListener.prototype.enterFilter_expression = function(ctx) {
	var ExpressionBuilder = require('./expressionBuilder');
	var expBldr = new ExpressionBuilder();
	this.memory.filters = expBldr.build(ctx.filterSpec());
};
QueryListener.prototype.addSingleKeyToMemory = function(key, spec){
	console.log('came here');
	this.memory.query = {};
	this.memory.query[key] = spec.getText();
}

QueryListener.prototype.addDoubleKeyToMemory = function(key1, spec1, key2, spec2){
	this.memory.query = {};
	this.memory.query[key1] = spec1.getText();
	this.memory.query[key2] = spec2.getText();
}

module.exports = QueryListener;