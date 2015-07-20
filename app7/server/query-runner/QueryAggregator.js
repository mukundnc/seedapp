var sc = require('./../../config/config').searchContext;

function QueryAggreagator(){

}

QueryAggreagator.prototype.getAggregates = function(query){
	this.query = query;
	this.context = query.searchContext;
	this.filters = query.filters ? query.filters.and.concat(query.filters.or) : null;
	this.init();
	var agg = {};
	switch(this.context){
		case sc.category :
			agg = this.getCategoryAgg();
			break;
		case sc.category_in_region :
			agg = this.getCategoryInRegionAgg();
			break;
		case sc.category_in_state :
			agg = this.getCategoryInStateAgg();
			break;
		case sc.category_in_city :
			agg = this.getCategoryInCityAgg();
			break;
		case sc.type :
			agg = this.getTypeAgg();
			break;
		case sc.type_in_region :
			agg = this.getTypeInRegionAgg();
			break;
		case sc.type_in_state :
			agg = this.getTypeInStateAgg();
			break;
		case sc.type_in_city :
			agg = this.getTypeInCityAgg();
			break;
		case sc.brand :
			agg = this.getBrandAgg();
			break;
		case sc.brand_in_region :
			agg = this.getBrandInRegionAgg();
			break;
		case sc.brand_in_state :
			agg = this.getBrandInStateAgg();
			break;
		case sc.brand_in_city :
			agg = this.getBrandInCityAgg();
			break;
		case sc.model :
			agg = this.getModelAgg();
			break;
		case sc.model_in_region :
			agg = this.getModelInRegionAgg();
			break;
		case sc.model_in_state :
			agg = this.getModelInStateAgg();
			break;
		case sc.model_in_city :
			agg = this.getModelInCityAgg();
			break;
		case sc.region :
			agg = this.getRegionAgg();
			break;
		case sc.state :
			agg = this.getStateAgg();
			break;
		case sc.city :
			agg = this.getCityAgg();
			break;		
		case sc.type_in_brand:
			agg = this.getBrandAgg();
			break;
	}
	this.addTimeAggregate(agg);
	return agg;
}

QueryAggreagator.prototype.init = function(){
	this.subjects = [];
	this.targets = [];
	this.hasDates = false;

	var subAndTarg = Object.keys(this.query);	
	if(subAndTarg.length > 0)
		this.subjects.push(subAndTarg[0]);
	if (subAndTarg.length > 1)
		this.targets.push(subAndTarg[1])

	if(!this.filters) return;

	this.filterNames = [];
	this.filters.forEach((function(f){
		this.filterNames.push(f.filter.name);
		if(!this.hasDates && f.filter.isDate)
			this.hasDates = true;
	}).bind(this));
}

QueryAggreagator.prototype.hasCategory = function(){
	return this.checkFilterByName('category');
}

QueryAggreagator.prototype.hasType = function(){
	return this.checkFilterByName('type');
}

QueryAggreagator.prototype.hasBrand = function(){
	return this.checkFilterByName('brand');
}

QueryAggreagator.prototype.hasModel = function(){
	return this.checkFilterByName('model');
}

QueryAggreagator.prototype.hasRegion = function(){
	return this.checkFilterByName('region');
}

QueryAggreagator.prototype.hasState = function(){
	return this.checkFilterByName('state');
}

QueryAggreagator.prototype.hasCity = function(){
	return this.checkFilterByName('city');
}

QueryAggreagator.prototype.checkFilterByName = function(fName){
	if(!this.filters) return false;

	return (this.filterNames.indexOf(fName) !== -1);
}

QueryAggreagator.prototype.getCategoryAggTemplate = function(){
	return {
		categories : {
			terms : {
				field : 'category',
				size : 5
			},
			aggs : this.getTypeAggTemplate()
		}
	};
}

QueryAggreagator.prototype.getTypeAggTemplate = function(){
	return {
		types : {
			terms : {
				field : 'type',
				size : 50
			},
			aggs : this.getBrandAggTemplate()
		}
	}
}

QueryAggreagator.prototype.getBrandAggTemplate = function(){
	return {
		brands : {
			terms : {
				field : 'brand',
				size : 50
			},
			aggs : this.getModelAggTemplate()
		}
	}
}

QueryAggreagator.prototype.getModelAggTemplate = function(){
	return {
		models : {
			terms : {
				field : 'model',
				size : 100
			},
			aggs : {}
		}
	}
}

QueryAggreagator.prototype.getRegionAggTemplate = function(){
	return {
		regions: {
			terms : {
				field : 'region',
				size : 5
			},
			aggs : this.getStateAggTemplate()
		}
	};
}

QueryAggreagator.prototype.getStateAggTemplate = function(){
	return {
		states : {
			terms : {
				field : 'state',
				size : 50
			},
			aggs : this.getCityAggTemplate()
		}
	}
}

QueryAggreagator.prototype.getCityAggTemplate = function(){
	return {
		cities : {
			terms : {
				field : 'city',
				size : 50
			},
			aggs : {}
		}
	}
}

QueryAggreagator.prototype.getCategoryAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'regions';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getRegionAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}

	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	else if(this.hasState()){
		keyRegions = 'states';
		aggRegion = this.getStateAggTemplate();
	}

	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];

	return aggs;
}

QueryAggreagator.prototype.getCategoryInRegionAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'states';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getStateAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}

	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];

	return aggs;
}

QueryAggreagator.prototype.getCategoryInStateAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'cities';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getCityAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}
	
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];

	return aggs;
	
}

QueryAggreagator.prototype.getCategoryInCityAgg = function(){
	var keyCategory = 'types';
	var aggCategory = this.getTypeAggTemplate();
	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}	
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;
}

QueryAggreagator.prototype.getTypeAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'regions';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getRegionAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}

	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	else if(this.hasState()){
		keyRegions = 'states';
		aggRegion = this.getStateAggTemplate();
	}

	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];

	return aggs;
}

QueryAggreagator.prototype.getTypeInRegionAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'states';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}

	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getTypeInStateAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'cities';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getCityAggTemplate();
	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getTypeInCityAgg = function(){
	var keyCategory = 'brands';
	var aggCategory = this.getBrandAggTemplate();
	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

QueryAggreagator.prototype.getBrandAgg = function(){
	var keyCategory = 'models';
	var keyRegions = 'regions';
	var aggCategory = this.getModelAggTemplate();
	var aggRegion = this.getRegionAggTemplate();
	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	else if(this.hasState()){
		keyRegions = 'states';
		aggRegion = this.getStateAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

QueryAggreagator.prototype.getBrandInRegionAgg = function(){
	var keyCategory = 'models';
	var keyRegions = 'states';
	var aggCategory = this.getModelAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getBrandInStateAgg = function(){
	var keyCategory = 'models';
	var keyRegions = 'cities';
	var aggCategory = this.getModelAggTemplate();
	var aggRegion = this.getCityAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getBrandInCityAgg = function(){
	var keyCategory = 'models';
	var aggCategory = this.getModelAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

QueryAggreagator.prototype.getModelAgg = function(){
	var keyRegions = 'regions';
	var aggRegion = this.getRegionAggTemplate();
	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	else if(this.hasState()){
		keyRegions = 'states';
		aggRegion = this.getStateAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

QueryAggreagator.prototype.getModelInRegionAgg = function(){
	var keyRegions = 'states';
	var aggRegion = this.getStateAggTemplate();
	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getModelInStateAgg = function(){
	var keyRegions = 'cities';
	var aggRegion = this.getCityAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getModelInCityAgg = function(){
	return {};
}

QueryAggreagator.prototype.getRegionAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'states';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getStateAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}
	else if(this.hasType()){
		keyCategory = 'types';
		aggCategory = this.getTypeAggTemplate();
	}

	if(this.hasCity()){
		keyRegions = 'cities';
		aggRegion = this.getCityAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];

	return aggs;
}

QueryAggreagator.prototype.getStateAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'cities';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getCityAggTemplate();

	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}
	else if(this.hasType()){
		keyCategory = 'types';
		aggCategory = this.getTypeAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

QueryAggreagator.prototype.getCityAgg = function(){
	var keyCategory = 'categories';
	var aggCategory = this.getCategoryAggTemplate();
	if(this.hasModel()){
		keyCategory = 'models';
		aggCategory = this.getModelAggTemplate();
	}
	else if(this.hasBrand()){
		keyCategory = 'brands';
		aggCategory = this.getBrandAggTemplate();
	}
	else if(this.hasType()){
		keyCategory = 'types';
		aggCategory = this.getTypeAggTemplate();
	}
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

QueryAggreagator.prototype.addTimeAggregate = function(agg){
	if(!agg.aggs) return;
	if(Object.keys(agg.aggs).length === 0) return;
	var root = agg.aggs;

	Object.keys(root).forEach((function(k){
		var t = this.getTimeAggregate();
		var tKey = Object.keys(t)[0];
		if(root[k].aggs)
			root[k].aggs[tKey] = t[tKey];
	}).bind(this));

}

QueryAggreagator.prototype.getTimeAggregate = function(){
	if(!this.hasDates)
		return this.getYearlyTimeAgg();
	var tDiff = this.getTimeDiffData();

	if(tDiff.isLT2Months)
		return this.getDailyTimeAgg();

	if(!tDiff.isGT1Year)
		return this.getMonthlyTimeAgg();

	return this.getYearlyTimeAgg();
}


QueryAggreagator.prototype.getTimeDiffData = function(){
	var dates = [];
	this.filters.forEach(function(f){
		if(f.filter.isDate)
			dates.push(new Date(f.filter.value));
	});
	var dStart = dates[1] > dates[0] ? dates[0] : dates[1];
	var dEnd = dates[1] > dates[0] ? dates[1] : dates[0];
	var dMs = dEnd - dStart;
	var dDays = dMs/(1000 * 60 * 60 * 24);
	var daysIn1Year = 366;

	return {
		isGT1Year : dDays >= daysIn1Year,
		isLT2Months : dDays < 61
	}
}

QueryAggreagator.prototype.getYearlyTimeAgg = function(){
	return {
		yearly : {
			date_histogram : {
				field : 'timestamp',
				interval : 'year',
				format : 'YYYY/MM/DD'
			}
		}
	}	

}

QueryAggreagator.prototype.getMonthlyTimeAgg = function(){
	return {
		monthly : {
			date_histogram : {
				field : 'timestamp',
				interval : 'month',
				format : 'YYYY/MM/DD'
			}
		}
	}	

}

QueryAggreagator.prototype.getDailyTimeAgg = function(){
	return {
		daily : {
			date_histogram : {
				field : 'timestamp',
				interval : 'day',
				format : 'YYYY/MM/DD'
			}
		}
	}	

}


module.exports = QueryAggreagator;