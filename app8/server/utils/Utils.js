var _ = require('underscore');

var productTypes = ['line', 'model', 'component'];
var supplierType = ['name', 'city', 'country'];

function isProductType(p){
	return _.contains(productTypes, p);
}

function isSupplierType(s){
	return _.contains(supplierType, s);
}

module.exports = {
	isProductType : isProductType,
	isSupplierType : isSupplierType
}