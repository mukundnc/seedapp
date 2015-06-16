function ResponseParser (){

}
var sc = {
	category : 1,
	category_in_region : 2,
	category_in_state : 3,
	category_in_city : 4,
	type : 5,
	type_in_region : 6,
	type_in_state : 7,
	type_in_city : 8,
	brand : 9,
	brand_in_region : 10,
	brand_in_state : 11,
	brand_in_city : 12,
	model : 13,
	model_in_region : 14,
	model_in_state : 15,
	model_in_city : 16,
	region : 17,
	state : 18,
	city : 19
};

ResponseParser.prototype.parse = function(apiRes){
	console.log(apiRes);
	this.query = apiRes.query.query;
	this.context = apiRes.query.searchContext;
	this.filters = apiRes.query.filters ? apiRes.query.filters.and.concat(apiRes.query.filters.or) : null;
	this.init();
	var uiObject = {};
	switch(this.context){
		case sc.category :
			uiObject = this.getCategoryUIObj();
			break;
		case sc.category_in_region :
			uiObject = this.getCategoryInRegionUIObj();
			break;
		case sc.category_in_state :
			uiObject = this.getCategoryInStateUIObj();
			break;
		case sc.category_in_city :
			uiObject = this.getCategoryInCityUIObj();
			break;
		case sc.type :
			uiObject = this.getTypeUIObj();
			break;
		case sc.type_in_region :
			uiObject = this.getTypeInRegionUIObj();
			break;
		case sc.type_in_state :
			uiObject = this.getTypeInStateUIObj();
			break;
		case sc.type_in_city :
			uiObject = this.getTypeInCityUIObj();
			break;
		case sc.brand :
			uiObject = this.getBrandUIObj();
			break;
		case sc.brand_in_region :
			uiObject = this.getBrandInRegionUIObj();
			break;
		case sc.brand_in_state :
			uiObject = this.getBrandInStateUIObj();
			break;
		case sc.brand_in_city :
			uiObject = this.getBrandInCityUIObj();
			break;
		case sc.model :
			uiObject = this.getModelUIObj();
			break;
		case sc.model_in_region :
			uiObject = this.getModelInRegionUIObj();
			break;
		case sc.model_in_state :
			uiObject = this.getModelInStateUIObj();
			break;
		case sc.model_in_city :
			uiObject = this.getModelInCityUIObj();
			break;
		case sc.region :
			uiObject = this.getRegionUIObj();
			break;
		case sc.state :
			uiObject = this.getStateUIObj();
			break;
		case sc.city :
			uiObject = this.getCityUIObj();
			break;		
	}
	this.addTimeAggregate(agg);
	return agg;

}

ResponseParser.prototype.init = function(){
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

ResponseParser.prototype.hasCategory = function(){
	return this.checkFilterByName('category');
}

ResponseParser.prototype.hasType = function(){
	return this.checkFilterByName('type');
}

ResponseParser.prototype.hasBrand = function(){
	return this.checkFilterByName('brand');
}

ResponseParser.prototype.hasModel = function(){
	return this.checkFilterByName('model');
}

ResponseParser.prototype.hasRegion = function(){
	return this.checkFilterByName('region');
}

ResponseParser.prototype.hasState = function(){
	return this.checkFilterByName('state');
}

ResponseParser.prototype.hasCity = function(){
	return this.checkFilterByName('city');
}

ResponseParser.prototype.checkFilterByName = function(fName){
	if(!this.filters) return false;

	return (this.filterNames.indexOf(fName) !== -1);
}

ResponseParser.prototype.getUIObjectTemplate = function(){
	return {
		key1 : this.getUIKeyTemplate(),
		key2 : this.getUIKeyTemplate()
	}
}

ResponseParser.prototype.getUIKeyTemplate = function(){
	return {
		name : '',
		timeSeries : {},
		product : {}
	}
}

ResponseParser.prototype.getCategoryUIObj = function(){
}

ResponseParser.prototype.getCategoryInRegionUIObj = function(){
}

ResponseParser.prototype.getCategoryInStateUIObj = function(){
}

ResponseParser.prototype.getCategoryInCityUIObj = function(){
}

ResponseParser.prototype.getTypeUIObj = function(){
}

ResponseParser.prototype.getTypeInRegionUIObj = function(){
}

ResponseParser.prototype.getTypeInStateUIObj = function(){
}

ResponseParser.prototype.getTypeInCityUIObj = function(){
}

ResponseParser.prototype.getBrandUIObj = function(){
}

ResponseParser.prototype.getBrandInRegionUIObj = function(){
}

ResponseParser.prototype.getBrandInStateUIObj = function(){
}

ResponseParser.prototype.getBrandInCityUIObj = function(){
}

ResponseParser.prototype.getModelUIObj = function(){
}

ResponseParser.prototype.getModelInRegionUIObj = function(){
}

ResponseParser.prototype.getModelInStateUIObj = function(){
}

ResponseParser.prototype.getModelInCityUIObj = function(){
}

ResponseParser.prototype.getRegionUIObj = function(){
}

ResponseParser.prototype.getStateUIObj = function(){
}

ResponseParser.prototype.getCityUIObj = function(){
}
