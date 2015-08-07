
var antlr4 = require('antlr4/index');


function ExpressionBuilder(){
	this.sysStartDate = '2000/01/01';
	this.sysEndDate = '2014/12/31';
	this.sysMaxYear = new Date(this.sysEndDate).getFullYear();
}

ExpressionBuilder.prototype.build = function(timeSpec){	
	var filters = [];
	if(timeSpec.timeInLastYearsSpec())
		filters = this.getTimeFiltersForInLastYears(timeSpec.timeInLastYearsSpec());

	if(timeSpec.timeInLastMonthsSpec())
		filters = this.getTimeFiltersForInLastMonths(timeSpec.timeInLastMonthsSpec());

	if(timeSpec.timeInLastDaysSpec())
		filters = this.getTimeFiltersForInLastDays(timeSpec.timeInLastDaysSpec());

	if(timeSpec.timeInYearSpec())
		filters = this.getTimeFiltersForInYear(timeSpec.timeInYearSpec());

	if(timeSpec.timeBetweenYearsSpec())
		filters = this.getTimeFiltersForBetweenYears(timeSpec.timeBetweenYearsSpec());

	if(timeSpec.timeBetweenDatesSpec())
		filters = this.getTimeFiltersForBetweenDates(timeSpec.timeBetweenDatesSpec());
	
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForInLastYears = function(timeSpec){
	var nVal = parseInt(timeSpec.NUM());
	var dist = nVal === 1 ? 'monthly' : 'yearly';
	var year = this.sysMaxYear - nVal + 1;
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : year + '/01/01',
			isDate : true,
			dist : dist
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : this.sysEndDate,
			isDate : true,
			dist : dist
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForInLastMonths = function(timeSpec){
	var nVal = parseInt(timeSpec.NUM());
	var tsnMonthsBack = Date.parse(this.sysEndDate) - (1000 * 60 * 60 * 24 * 30.5 * nVal);
	var dtnMonthsBack = new Date(tsnMonthsBack);
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : dtnMonthsBack.getFullYear() + '/' + (dtnMonthsBack.getMonth() + 1) + '/' + dtnMonthsBack.getDate(),
			isDate : true,
			dist : 'monthly'
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : this.sysEndDate,
			isDate : true,
			dist : 'monthly'
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForInLastDays = function(timeSpec){
	var filters = [];
	var nVal = parseInt(timeSpec.NUM());
	var tsnDaysBack = Date.parse(this.sysEndDate) - (1000 * 60 * 60 * 24 * nVal);
	var dtnDaysBack = new Date(tsnDaysBack);
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : dtnDaysBack.getFullYear() + '/' + (dtnDaysBack.getMonth() + 1) + '/' + dtnDaysBack.getDate(),
			isDate : true,
			dist : 'daily'
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : this.sysEndDate,
			isDate : true,
			dist : 'daily'
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForInYear = function(timeSpec){
	var year = timeSpec.NUM();
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : year + '/01/01',
			isDate : true,
			dist : 'monthly'
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : year + '/12/31',
			isDate : true,
			dist : 'monthly'
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForBetweenYears = function(timeSpec){
	var years = timeSpec.NUM();
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : years[0] + '/01/01',
			isDate : true,
			dist : 'yearly'
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : years[1] + '/12/31',
			isDate : true,
			dist : 'yearly'
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getTimeFiltersForBetweenDates = function(timeSpec){
	var dates = timeSpec.YYYY_MM_DD();
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : dates[0].getText(),
			isDate : true,
			dist : 'yearly'
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : dates[1].getText(),
			isDate : true,
			dist : 'yearly'
		}
	});
	return filters;
}

module.exports = ExpressionBuilder;

