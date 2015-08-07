var _ = require('underscore');

var productTypes = ['line', 'model', 'component', 'lines', 'models', 'components'];
var supplierType = ['name', 'city', 'country', 'names', 'cities', 'countries'];
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
module.exports = {
	isProductType : isProductType,
	isSupplierType : isSupplierType,
	isTimeType : isTimeType,
	isRegionType : isRegionType
}