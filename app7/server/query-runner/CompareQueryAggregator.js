var sc = require('./../../config/config').searchContext;

function CompareQueryAggreagator(){
}

CompareQueryAggreagator.prototype.getAggregates = function(query){
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
	}
	this.addTimeAggregate(agg);
	return agg;
}

CompareQueryAggreagator.prototype.init = function(){
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

CompareQueryAggreagator.prototype.hasCategory = function(){
	return this.checkFilterByName('category');
}

CompareQueryAggreagator.prototype.hasType = function(){
	return this.checkFilterByName('type');
}

CompareQueryAggreagator.prototype.hasBrand = function(){
	return this.checkFilterByName('brand');
}

CompareQueryAggreagator.prototype.hasModel = function(){
	return this.checkFilterByName('model');
}

CompareQueryAggreagator.prototype.hasRegion = function(){
	return this.checkFilterByName('region');
}

CompareQueryAggreagator.prototype.hasState = function(){
	return this.checkFilterByName('state');
}

CompareQueryAggreagator.prototype.hasCity = function(){
	return this.checkFilterByName('city');
}

CompareQueryAggreagator.prototype.checkFilterByName = function(fName){
	if(!this.filters) return false;

	return (this.filterNames.indexOf(fName) !== -1);
}

CompareQueryAggreagator.prototype.getCategoryAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getTypeAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getBrandAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getModelAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getRegionAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getStateAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getCityAggTemplate = function(){
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

CompareQueryAggreagator.prototype.getCategoryAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'regions';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getCategoryInRegionAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'states';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getCategoryInStateAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'cities';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getCityAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getCategoryInCityAgg = function(){
	var keyCategory = 'categories';
	var aggCategory = this.getTypeAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;
}

CompareQueryAggreagator.prototype.getTypeAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'regions';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getTypeInRegionAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'states';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getTypeInStateAgg = function(){
	var keyCategory = 'types';
	var keyRegions = 'states';
	var aggCategory = this.getTypeAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getTypeInCityAgg = function(){
	var keyCategory = 'types';
	var aggCategory = this.getTypeAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

CompareQueryAggreagator.prototype.getBrandAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'regions';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getBrandInRegionAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'states';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getBrandInStateAgg = function(){
	var keyCategory = 'brands';
	var keyRegions = 'cities';
	var aggCategory = this.getBrandAggTemplate();
	var aggRegion = this.getCityAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getBrandInCityAgg = function(){
	var keyCategory = 'brands';
	var aggCategory = this.getBrandAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

CompareQueryAggreagator.prototype.getModelAgg = function(){
	var keyRegions = 'regions';
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getModelInRegionAgg = function(){
	var keyRegions = 'regions';
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getModelInStateAgg = function(){
	var keyRegions = 'states';
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getModelInCityAgg = function(){
	return {};
}

CompareQueryAggreagator.prototype.getRegionAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'regions';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getRegionAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;
}

CompareQueryAggreagator.prototype.getStateAgg = function(){
	var keyCategory = 'categories';
	var keyRegions = 'states';
	var aggCategory = this.getCategoryAggTemplate();
	var aggRegion = this.getStateAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	aggs.aggs[keyRegions] = aggRegion[keyRegions];
	return aggs;	
}

CompareQueryAggreagator.prototype.getCityAgg = function(){
	var keyCategory = 'categories';
	var aggCategory = this.getCategoryAggTemplate();
	var aggs = {aggs : {}};
	aggs.aggs[keyCategory] = aggCategory[keyCategory];
	return aggs;	
}

CompareQueryAggreagator.prototype.addTimeAggregate = function(agg){
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

CompareQueryAggreagator.prototype.getTimeAggregate = function(){
	if(!this.hasDates)
		return this.getYearlyTimeAgg();
	var tDiff = this.getTimeDiffData();

	if(tDiff.isLT2Months)
		return this.getDailyTimeAgg();

	if(!tDiff.isGT1Year)
		return this.getMonthlyTimeAgg();

	return this.getYearlyTimeAgg();
}


CompareQueryAggreagator.prototype.getTimeDiffData = function(){
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

CompareQueryAggreagator.prototype.getYearlyTimeAgg = function(){
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

CompareQueryAggreagator.prototype.getMonthlyTimeAgg = function(){
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

CompareQueryAggreagator.prototype.getDailyTimeAgg = function(){
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


module.exports = CompareQueryAggreagator;