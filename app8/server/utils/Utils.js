var _ = require('underscore');

var productTypes = ['line', 'model', 'component', 'lines', 'models', 'components'];
var supplierType = ['name', 'city', 'country', 'names', 'cities', 'countries'];
var ddProductTypes = ['line', 'lines', 'model', 'models'];
var ddRegionTypes = ['country','countries', 'city', 'cities'];

var timeTypes = ['yearly', 'monthly', 'daily'];

function isProductType(p){
	return _.contains(productTypes, p);
}

function isSupplierType(s){
	return _.contains(supplierType, s);
}

function isRegionType(r){
	return isSupplierType(r);
}

function isTimeType(t){
	return _.contains(timeTypes, t);
}

function isDDProductType(p){
	return _.contains(ddProductTypes, p);
}

function isDDRegionType(r){
	return _.contains(ddRegionTypes, r);
}

function getQueryString (queryParams, qSource, qTarget, isSpendPresent){
	var q = '';
	var PART_SPEND = ' part ';
	var PART_SPEND_FROM = ' part from ';
	if(isSpendPresent){
		PART_SPEND = ' spend ';
		PART_SPEND_FROM = ' spend from ';
	}
	if(!qTarget.isPresent){
		if(isProductType(queryParams.type)){
			if(isProductType(qSource.key)){
				//Single word product drill down  search
				q = queryParams.label + PART_SPEND;
			}
			else{
				//product drilldown in region
				q = queryParams.label + PART_SPEND_FROM + qSource.values[0]; 
			}
		}
		else{
			if(isRegionType(qSource.key)){
				//Single word region drill down  search
				q = PART_SPEND_FROM + queryParams.label;
			}
			else{
				//Org query now in region
				q = qSource.values[0]  + PART_SPEND_FROM+ queryParams.label;
			}
		}
	}
	else{
		if(isProductType(queryParams.type)){
			//Drilldown product in region search
			q = queryParams.label + PART_SPEND_FROM + qTarget.values[0];
		}
		else{
			//Org query now in region drilldown
			q = qSource.values[0]  + PART_SPEND_FROM + queryParams.label;
		}
	}
	return q;
}

module.exports = {
	isProductType : isProductType,
	isSupplierType : isSupplierType,
	isDDProductType : isDDProductType,
	isDDRegionType : isDDRegionType,	
	isTimeType : isTimeType,
	isRegionType : isRegionType,
	getQueryString : getQueryString
}