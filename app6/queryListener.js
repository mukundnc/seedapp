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

QueryListener.prototype.exitQuery = function(ctx){
	this.cbOnExitQuery(this.memory);
}

// Enter a parse tree produced by salesParser#category_in_region.
QueryListener.prototype.enterCategory_in_region = function(ctx) {
	this.addToMemory('category', ctx.categorySpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#category_in_state.
QueryListener.prototype.enterCategory_in_state = function(ctx) {
	this.addToMemory('category', ctx.categorySpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#category_in_city.
QueryListener.prototype.enterCategory_in_city = function(ctx) {
	this.addToMemory('category', ctx.categorySpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#type_in_region.
QueryListener.prototype.enterType_in_region = function(ctx) {
	this.addToMemory('type', ctx.typeSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#type_in_state.
QueryListener.prototype.enterType_in_state = function(ctx) {
	this.addToMemory('type', ctx.typeSpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#type_in_city.
QueryListener.prototype.enterType_in_city = function(ctx) {
	this.addToMemory('type', ctx.typeSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#brand_in_region.
QueryListener.prototype.enterBrand_in_region = function(ctx) {
	this.addToMemory('brand', ctx.brandSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#brand_in_state.
QueryListener.prototype.enterBrand_in_state = function(ctx) {
	this.addToMemory('brand', ctx.brandSpec(), 'state', ctx.stateSpec());
};

// Enter a parse tree produced by salesParser#brand_in_city.
QueryListener.prototype.enterBrand_in_city = function(ctx) {
	this.addToMemory('brand', ctx.brandSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#model_in_region.
QueryListener.prototype.enterModel_in_region = function(ctx) {
	this.addToMemory('model', ctx.modelSpec(), 'region', ctx.regionSpec());
};

// Enter a parse tree produced by salesParser#model_in_state.
QueryListener.prototype.enterModel_in_state = function(ctx) {
	this.addToMemory('model', ctx.modelSpec(), 'state', ctx.stateSpec());
};


// Enter a parse tree produced by salesParser#model_in_city.
QueryListener.prototype.enterModel_in_city = function(ctx) {
	this.addToMemory('model', ctx.modelSpec(), 'city', ctx.citySpec());
};

// Enter a parse tree produced by salesParser#filter_expression.
QueryListener.prototype.enterFilter_expression = function(ctx) {
	this.memory.filter = {value: ctx.filterSpec().getText()};
};

QueryListener.prototype.addToMemory = function(key1, spec1, key2, spec2){
	this.memory.query = {};
	this.memory.query[key1] = spec1.getText();
	this.memory.query[key2] = spec2.getText();
}

module.exports = QueryListener;