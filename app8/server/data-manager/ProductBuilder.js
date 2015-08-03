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

ProductBuilder.prototype.testFunction = function(){
	var csv = require("fast-csv");
	var _ = require('underscore');
	var i = 0;
	var models = [], components = [], suppliers = [], cities = [], countries = [];

	function logArr(arr){
		var s = '';
		arr.forEach(function(a){
			s += '\'' + a + '\'  | ';
		});
		console.log(s);
		console.log('******************************************************************************************************************************');
	}

	csv.fromPath('/Users/vishal/Downloads/CAT-MW-Data-2.csv', {headers:false})
	   .on("data", function(data){
		   	if(i > 0){
		   		models.push(data[1].toLowerCase());
		   		components.push(data[2].toLowerCase());
		   		suppliers.push(data[9].toLowerCase());
		   		cities.push(data[10].toLowerCase());
		   		countries.push(data[11].toLowerCase());		   		
		   	}
		    i++;
		})
		.on("end", function(){
		     models = _.uniq(models);
		     components = _.uniq(components);
		     suppliers = _.uniq(suppliers);
		     cities = _.uniq(cities);
		     countries = _.uniq(countries);
		     logArr(models);
		     logArr(components);
		     logArr(suppliers);
		     logArr(cities);
		     logArr(countries);
		}); 
}

module.exports = ProductBuilder;