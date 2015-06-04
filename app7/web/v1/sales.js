$(document).ready(onAppReady);

function onAppReady(){
	var salesApp = new SalesApp();
}

function SalesApp (){
	this.init();
	this.sales = {};
}

SalesApp.prototype.init = function(){
	var self = this;
	$.ajax({
		url : 'sales.txt',
		type : 'GET',
		success : function (d){
			var obj = JSON.parse(d);
			self.sales = obj.sales;
			self.updateUI();
		},
		error: function(err){
			console.error('error in ajax');
		}
	});
}

SalesApp.prototype.updateUI = function(){
	var sYearKey = this.getCurrentSalesYearKey();

	if(!this.sales[sYearKey])
		this.sales[sYearKey] = this.getDefaultValuesForSalesYear();
	
	var regions = ['east', 'west', 'north', 'south'];
	

}

SalesApp.prototype.getCurrentSalesYearKey = function(){
	return 's' + $('#year').val();
}
SalesApp.prototype.getAllInputValues = function(){
	var self = this;
	var allInputs = []
	var jqSels = ['.eastContainer input', '.westContainer input', '.northContainer input', '.southContainer input'];
	jqSels.forEach(function(jqSel){
		allInputs = allInputs.concat(self.getInputValuesForRegion(jqSel));
	});
	return $(allInputs);
}

SalesApp.prototype.getInputControlsForRegion = function(region){
	var map = {
		'east' : '.eastContainer input',
		'west' : '.westContainer input',
		'north' : '.northContainer input',
		'south' : '.southContainer input'
	};
	var $inputs = $(map[region]);
	var q1 = [], q2 = [], q3 = [], q4 = [];
	$.each($inputs, function(idx){
		var key = idx % 4;
		switch(key){
			case 0 : q1.push($(this)); break;
			case 1 : q2.push($(this)); break;
			case 2 : q3.push($(this)); break;
			case 3 : q4.push($(this)); break;
		}
	});

	var arr = q1.concat(q2);
	arr = arr.concat(q3);
	arr = arr.concat(q4);
	return arr;
}

SalesApp.prototype.getDefaultValuesForSalesYear = function(){
	var sale = {};
	sale = {
		q1 : {
			east:{
				automobiles : 1,
				electronics : 2,
				appliances : 3,
				cloths : 4
			},
			west:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			north:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			south:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			}
		},
		q2 : {
			east:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			west:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			north:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			south:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			}
		},
		q3 : {
			east:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			west:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			north:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			south:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			}
		},
		q4 : {
			east:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			west:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			north:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			},
			south:{
				automobiles : 0,
				electronics : 0,
				appliances : 0,
				cloths : 0
			}
		}
	}
	return sale;
}