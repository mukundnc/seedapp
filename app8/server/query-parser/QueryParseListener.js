var _ = require('underscore');
var QueryParseListenerBase = require('./antlr/generated/salesListener').salesListener;
var ExpressionBuilder = require('./ExpressionBuilder');
var logger = require('./../utils/Logger');
var sc = require('./../../config/config').searchContext;
var allRegions = require('./../data-manager/Regions');
var dict = require('./../../config/Dictionary');

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
		data : this.memory
	});
	//console.log(JSON.stringify(this.memory));
	logger.log('exit query');
}

// Enter a parse tree produced by salesParser#category_region_spec.
QueryParseListener.prototype.enterCategory_region_spec = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'region', ctx.regionSpec(), sc.category_in_region);
};

// Enter a parse tree produced by salesParser#category_state_spec.
QueryParseListener.prototype.enterCategory_state_spec = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'state', ctx.stateSpec(), sc.category_in_state);
};

// Enter a parse tree produced by salesParser#category_city_spec.
QueryParseListener.prototype.enterCategory_city_spec = function(ctx) {
	this.addDoubleKeysToMemory('category', ctx.categorySpec(), 'city', ctx.citySpec(), sc.category_in_city);
};

// Enter a parse tree produced by salesParser#type_region_spec.
QueryParseListener.prototype.enterType_region_spec = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'region', ctx.regionSpec(), sc.type_in_region);
};

// Enter a parse tree produced by salesParser#type_state_spec.
QueryParseListener.prototype.enterType_state_spec = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'state', ctx.stateSpec(), sc.type_in_state);
};

// Enter a parse tree produced by salesParser#type_city_spec.
QueryParseListener.prototype.enterType_city_spec = function(ctx) {
	this.addDoubleKeysToMemory('type', ctx.typeSpec(), 'city', ctx.citySpec(), sc.type_in_city);
};

// Enter a parse tree produced by salesParser#brand_region_spec.
QueryParseListener.prototype.enterBrand_region_spec = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'region', ctx.regionSpec(), sc.brand_in_region);
};

// Enter a parse tree produced by salesParser#brand_state_spec.
QueryParseListener.prototype.enterBrand_state_spec = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'state', ctx.stateSpec(), sc.brand_in_state);
};

// Enter a parse tree produced by salesParser#brand_city_spec.
QueryParseListener.prototype.enterBrand_city_spec = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'city', ctx.citySpec(), sc.brand_in_city);
};

// Enter a parse tree produced by salesParser#brand_type_spec.
QueryParseListener.prototype.enterBrand_type_spec = function(ctx) {
	this.addDoubleKeysToMemory('brand', ctx.brandSpec(), 'type', ctx.typeSpec(), sc.type_in_brand);
};

// Enter a parse tree produced by salesParser#model_region_spec.
QueryParseListener.prototype.enterModel_region_spec = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'region', ctx.regionSpec(), sc.model_in_region);
};

// Enter a parse tree produced by salesParser#model_state_spec.
QueryParseListener.prototype.enterModel_state_spec = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'state', ctx.stateSpec(), sc.model_in_state);
};

// Enter a parse tree produced by salesParser#model_city_spec.
QueryParseListener.prototype.enterModel_city_spec = function(ctx) {
	this.addDoubleKeysToMemory('model', ctx.modelSpec(), 'city', ctx.citySpec(), sc.model_in_city);
};

// Enter a parse tree produced by salesParser#region_category_spec.
QueryParseListener.prototype.enterRegion_category_spec = function(ctx) {
	this.enterCategory_region_spec(ctx);
};

// Enter a parse tree produced by salesParser#region_type_spec.
QueryParseListener.prototype.enterRegion_type_spec = function(ctx) {
	this.enterType_region_spec(ctx);
};

// Enter a parse tree produced by salesParser#region_brand_spec.
QueryParseListener.prototype.enterRegion_brand_spec = function(ctx) {
	this.enterBrand_region_spec(ctx);
};

// Enter a parse tree produced by salesParser#region_model_spec.
QueryParseListener.prototype.enterRegion_model_spec = function(ctx) {
	this.enterModel_region_spec(ctx);
};

// Enter a parse tree produced by salesParser#state_category_spec.
QueryParseListener.prototype.enterState_category_spec = function(ctx) {
	this.enterCategory_state_spec(ctx);
};

// Enter a parse tree produced by salesParser#state_type_spec.
QueryParseListener.prototype.enterState_type_spec = function(ctx) {
	this.enterType_state_spec(ctx);
};

// Enter a parse tree produced by salesParser#state_brand_spec.
QueryParseListener.prototype.enterState_brand_spec = function(ctx) {
	this.enterBrand_state_spec(ctx);
};

// Enter a parse tree produced by salesParser#state_model_spec.
QueryParseListener.prototype.enterState_model_spec = function(ctx) {
	this.enterModel_state_spec(ctx);
};

// Enter a parse tree produced by salesParser#city_category_spec.
QueryParseListener.prototype.enterCity_category_spec = function(ctx) {
	this.enterCategory_city_spec(ctx);
};

// Enter a parse tree produced by salesParser#city_type_spec.
QueryParseListener.prototype.enterCity_type_spec = function(ctx) {
	this.enterType_city_spec(ctx);
};

// Enter a parse tree produced by salesParser#city_brand_spec.
QueryParseListener.prototype.enterCity_brand_spec = function(ctx) {
	this.enterBrand_city_spec(ctx);
};

// Enter a parse tree produced by salesParser#city_model_spec.
QueryParseListener.prototype.enterCity_model_spec = function(ctx) {
	this.enterModel_city_spec(ctx);
};

// Enter a parse tree produced by salesParser#single_entity_spec.
QueryParseListener.prototype.enterSingle_entity_spec = function(ctx) {
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

	if(ctx.modelSpec()){
		if(this.isCitySpec(ctx.modelSpec()))
			this.addSingleKeyToMemory('city', ctx.modelSpec(), sc.city);
		else 
			this.addSingleKeyToMemory('model', ctx.modelSpec(), sc.model);
	}
};

// Enter a parse tree produced by salesParser#region_spec.
QueryParseListener.prototype.enterRegion_spec = function(ctx) {
	var regions = ['region', 'state', 'city'];
	for(var key in this.memory){
		if(regions.indexOf(key) !== -1)
			return;
	}
	var key = '';
	var spec = null;

	if(ctx.regionSpec().length){
		key = 'region';
		spec = ctx.regionSpec();	
	}
	
	if(ctx.stateSpec().length){
		key = 'state';
		spec = ctx.stateSpec();
	}
	
	if(ctx.citySpec().length){
		key = 'city';
		spec = ctx.citySpec();
	}

	this.memory.searchContext = this.getSearchContextForIn(key);
	this.memory.query[key] = [];
	if(Array.isArray(spec)){
		spec.forEach((function(s){
			this.memory.query[key].push(s.getText());
		}).bind(this));
	}
	else{
		this.memory.query[key].push(spec.getText());
	}

};

// Enter a parse tree produced by salesParser#time_spec.
QueryParseListener.prototype.enterTime_spec = function(ctx) {
	var expBldr = new ExpressionBuilder();
	this.memory.filters = expBldr.build(ctx.timeSpec());
};

QueryParseListener.prototype.addSingleKeyToMemory = function(key, spec, searchContext){
	if (spec.length === 0) return;

	this.memory.query = {};
	this.memory.query[key] = [];
	this.memory.searchContext = searchContext;
	spec.forEach((function(s){
		this.memory.query[key].push(s.getText());
	}).bind(this));
}

QueryParseListener.prototype.addDoubleKeysToMemory = function(key1, spec1, key2, spec2, searchContext){
	this.memory.query = {};
	this.memory.query[key1] = [];
	this.memory.query[key2] = [];
	this.memory.searchContext = searchContext;

	if(Array.isArray(spec1)){
		spec1.forEach((function(s){
			this.memory.query[key1].push(s.getText());
		}).bind(this));
	}
	else{
		this.memory.query[key1].push(spec1.getText());
	}
	
	if(Array.isArray(spec2)){
		spec2.forEach((function(s){
			this.memory.query[key2].push(s.getText());
		}).bind(this));
	}
	else{
		this.memory.query[key2].push(spec2.getText());
	}
}

QueryParseListener.prototype.isCitySpec = function(spec){
	if (spec.length === 0) return false;
	
	var arr = [];
	spec.forEach(function(s){
		arr.push(s.getText());
	});
	var res = _.where(allRegions, {'city' : dict.getDomainQualifiedStr(arr[0])});
	return res && res.length > 0;
}

QueryParseListener.prototype.getSearchContextForIn = function(inRegionKey){
	var keys = Object.keys(this.memory.query);
	if(keys.length > 1) return this.memory.searchContext;
	if(keys.length === 0){
		switch(inRegionKey){
			case 'region' : return sc.region;
			case 'state' : return sc.state;
			case 'city' : return sc.city;
		}
	}

	var srcKey = keys[0];
	switch(srcKey){
		case 'category' : 
			if(inRegionKey === 'region') return sc.category_in_region;
			if(inRegionKey === 'state') return sc.category_in_state;
			if(inRegionKey === 'city') return sc.category_in_city;
		case 'type' : 
			if(inRegionKey === 'region') return sc.type_in_region;
			if(inRegionKey === 'state') return sc.type_in_state;
			if(inRegionKey === 'city') return sc.type_in_city;
		case 'brand' : 
			if(inRegionKey === 'region') return sc.brand_in_region;
			if(inRegionKey === 'state') return sc.brand_in_state;
			if(inRegionKey === 'region') return sc.brand_in_city;
		case 'model' : 
			if(inRegionKey === 'region') return sc.model_in_region;
			if(inRegionKey === 'state') return sc.model_in_state;
			if(inRegionKey === 'region') return sc.model_in_city;
	}
}
module.exports = QueryParseListener;
