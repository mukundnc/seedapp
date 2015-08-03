var _ = require('underscore');
var logger = require('./../utils/Logger');
var dictonary = require('./../../config/Dictionary');
var config = require('./../../config/config');
var csv = require("fast-csv");

function ProductBuilder(){

}

ProductBuilder.prototype.getSalesProducts = function(cbOnDone){	
	var self = this;
	var sales = [];
	var i = 0;
	csv.fromPath(config.saleStrategy.strategyFileName, {headers:false})
	   .on("data", function(data){
		   	if(i > 0){
		   		var quantity = parseInt(data[6]);
		   		var object = {
		   			product : {
			     		line : data[0],
			     		model : data[1],
			     		component : data[2]
			     	},
			     	supplier : {
			     		name : data[9],
			     		city : data[10],
			     		country : data[11]
			     	},
			     	quantity : 1,
			     	rate : parseFloat(data[7]),
			     	amount : parseFloat(data[8]),
			     	date : data[5]
		   		};
		   		for(var j = 0; j < quantity; j++)
		   			sales.push(object);
		   	}
		    i++;
		})
		.on("end", function(){
		     logger.log(sales.length);
		     cbOnDone(sales);
		});
}

ProductBuilder.prototype.getDate = function(sDate){
	var dt = new Date(sDate);
	return dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate();
}
module.exports = ProductBuilder;