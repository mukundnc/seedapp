
function DateTime(){

}

DateTime.prototype.getDateRangeFromFilters = function(filters){
	var dateRange = { hasDates : false, startDate: '2000/01/01', endDate: '2000/01/01'};

	if(!filters) return dateRange;

	var andOrFilters = filters.and.concat(filters.or);

	var map = {};

	andOrFilters.forEach(function(filter){
		if(filter.filter.isDate){
			map[filter.filter.operator] = filter.filter.value;
		}
	});


	var keys = Object.keys(map);
	if(keys.length === 0) return dateRange;

	
	var minStartDate = '2000/01/01';
	var maxEndDate = '2015/12/31';

	if(keys.length === 1 && this.isEQ(keys[0])){
		dateRange.hasDates = true;
		dateRange.startDate = map[keys[0]];
		dateRange.endDate = map[keys[0]];
		return dateRange;
	}

	if(keys.length === 1 && this.isLT_Or_LE_Or_To(keys[0])){
		dateRange.hasDates = true;
		dateRange.startDate = minStartDate;
		dateRange.endDate = map[keys[0]];
		return dateRange;
	}

	if(keys.length === 1 && this.isGT_Or_GE_Or_From(keys[0])){
		dateRange.hasDates = true;
		dateRange.endDate = maxEndDate;
		dateRange.startDate = map[keys[0]];
		return dateRange;
	}	

	var eDate = map['<'] || map['<='] || map['to'];
	var sDate = map['>'] || map['>='] || map['from'];


	if(sDate && eDate){
		dateRange.hasDates = true;
		dateRange.endDate = eDate;
		dateRange.startDate = sDate;
		return dateRange;
	}		

	return dateRange;
}

DateTime.prototype.isEQ = function(op){
	return op === '=' || op === 'is';
}

DateTime.prototype.isLT = function(op){
	return op === '<';
}

DateTime.prototype.isLE = function(op){
	return op === '<=';
}

DateTime.prototype.isFrom = function(op){
	return op === 'from';
}

DateTime.prototype.isLT_Or_LE = function(op){
	return this.isLT(op) || this.isLE(op);
}

DateTime.prototype.isLT_Or_LE_Or_To = function(op){
	return this.isLT_Or_LE(op) || this.isTo(op);
}

DateTime.prototype.isGT = function(op){
	return op === '>';
}

DateTime.prototype.isGE = function(op){
	return op === '>=';
}

DateTime.prototype.isTo = function(op){
	return op === 'to';
}

DateTime.prototype.isGT_Or_GE = function(op){
	return this.isGT(op) || this.isGE(op);
}

DateTime.prototype.isGT_Or_GE_Or_From = function(op){
	return this.isGT_Or_GE(op) || this.isFrom(op);
}

var gDateTime = new DateTime();

module.exports = gDateTime;