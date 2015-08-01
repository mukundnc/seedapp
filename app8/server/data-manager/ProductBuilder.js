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
		   		sales.push({
			     	product : {
			     		line : data[1],
			     		model : data[2],
			     		component : data[4]
			     	},
			     	supplier : {
			     		name : data[5],
			     		city : data[6],
			     		country : data[7]
			     	},
			     	quantity : parseInt(data[8]),
			     	rate : parseFloat(data[9]),
			     	amount : parseFloat(data[10]),
			     	date : self.getDate(data[11])
			     });
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