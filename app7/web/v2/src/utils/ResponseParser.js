function ResponseParser (){

}

ResponseParser.prototype.parse = function(apiRes){
	console.log(apiRes);
	this.query = apiRes.query.query;
	this.filters = apiRes.query.filters ? apiRes.query.filters.and.concat(apiRes.query.filters.or) : null;
	this.init();

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
