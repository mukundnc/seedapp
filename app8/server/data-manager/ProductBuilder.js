var _ = require('underscore');
var logger = require('./../utils/Logger');
var dictonary = require('./../../config/Dictionary');
var config = require('./../../config/config');
var csv = require("fast-csv");

function ProductBuilder(){
	//this.csvFileName = config.saleStrategy.strategyFileName;
	this.csvFileName = '/Users/vishal/Downloads/CAT_data_Dump.csv'; 
}

ProductBuilder.prototype.getSalesProducts = function(cbOnDone){	
	var self = this;
	var sales = [];
	var i = 0;
	csv.fromPath(this.csvFileName, {headers:false})
	   .on("data", function(data){
		   	if(i > 0 && data.length === 12){
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

ProductBuilder.prototype.saveData = function(){
	this.logUniqueColsLowerCase();
	this.logDomainMap();
}

ProductBuilder.prototype.logUniqueColsLowerCase = function(){
	var i = 0;
	var lines = [], models = [], components = [], suppliers = [], cities = [], countries = [];

	function logArr(arr){
		var s = '';
		arr.forEach(function(a){
			s += '\'' + a + '\'  | ';
		});
		console.log(s);
		console.log('******************************************************************************************************************************');
	}

	csv.fromPath(this.csvFileName, {headers:false})
	   .on("data", function(data){	   	
		   	if(i > 0){
		   		//console.log(i, data);
		   		if(data.length === 12){
			   		lines.push(data[0].toLowerCase());
			   		models.push(data[1].toLowerCase());
			   		components.push(data[2].toLowerCase());
			   		suppliers.push(data[9].toLowerCase());
			   		cities.push(data[10].toLowerCase());
			   		countries.push(data[11].toLowerCase());		
			   	}   		
		   	}
		    i++;
		})
		.on("end", function(){
			 lines = _.uniq(lines);
		     models = _.uniq(models);
		     components = _.uniq(components);
		     suppliers = _.uniq(suppliers);
		     cities = _.uniq(cities);
		     countries = _.uniq(countries);
		     logArr(lines);
		     logArr(models);
		     logArr(components);
		     logArr(suppliers);
		     logArr(cities);
		     logArr(countries);
		}); 
}

ProductBuilder.prototype.logDomainMap = function(){
	var i = 0;
	var domain = [];
	csv.fromPath(this.csvFileName, {headers:false})
	   .on("data", function(data){
		   	if(i > 0){
		   		if(data.length === 12){
			   		domain.push(data[0]);
			   		domain.push(data[1]);
			   		domain.push(data[2]);
			   		domain.push(data[9]);
			   		domain.push(data[10]);
			   		domain.push(data[11]);	
		   		}	   		
		   	}
		    i++;
		})
		.on("end", function(){
		     domain = _.uniq(domain);
		     domain.forEach(function(d){
		     	var s = '\'' + d.toLowerCase() + '\' : \'' + d + '\',';
		     	console.log(s);
		     });
		}); 
}
module.exports = ProductBuilder;