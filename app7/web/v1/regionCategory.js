function RegionCategory (){
	this.init();
	this.sales = {};
}

RegionCategory.prototype.init = function(){
	var self = this;
	$.ajax({
		url : 'sales.txt',
		type : 'GET',
		success : function (d){
			var obj = JSON.parse(d);
			self.sales = obj.sales.region_category;
			self.updateUI();
		},
		error: function(err){
			console.error('error in ajax');
		}
	});
	this.addEventHandlers();
}

RegionCategory.prototype.addEventHandlers = function(){
	$('.sinput').on('focusout', this.updateSalesObject.bind(this));
	$('#year').on('change', this.updateUI.bind(this));
	
}

RegionCategory.prototype.updateUI = function(){
	var sYearKey = this.getCurrentSalesYearKey();

	if(!this.sales[sYearKey])
		this.sales[sYearKey] = this.getDefaultValuesForSalesYear();
	
	var regions = ['east', 'west', 'north', 'south'];
	
	regions.forEach((function(r){
		this.updateUIForRegion(r, this.sales[sYearKey])
	}).bind(this));

	this.updateSalesCounters();
}

RegionCategory.prototype.updateSalesObject = function(){
	var sYearKey = this.getCurrentSalesYearKey();

	if(!this.sales[sYearKey])
		console.error('no sales object');
	
	var regions = ['east', 'west', 'north', 'south'];
	
	regions.forEach((function(r){
		this.updateSalesObjectForRegion(r, this.sales[sYearKey])
	}).bind(this));

	this.updateSalesCounters(sYearKey);
}

RegionCategory.prototype.getCurrentSalesYearKey = function(){
	return 's' + $('#year').val();
}


RegionCategory.prototype.updateUIForRegion = function(region, sales){
	var inputs = this.getInputControlsForRegion(region);
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var i = 0;

	qArr.forEach(function(q){
		$(inputs[i]).val(sales[q][region]['automobiles']); i++;
		$(inputs[i]).val(sales[q][region]['electronics']); i++;
		$(inputs[i]).val(sales[q][region]['appliances']); i++;
		$(inputs[i]).val(sales[q][region]['cloths']); i++;
	});
}

RegionCategory.prototype.updateSalesObjectForRegion = function(region, sales){
	var inputs = this.getInputControlsForRegion(region);
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var i = 0;

	qArr.forEach(function(q){
		sales[q][region]['automobiles'] = parseInt($(inputs[i]).val()); i++;
		sales[q][region]['electronics'] = parseInt($(inputs[i]).val()); i++;
		sales[q][region]['appliances'] = parseInt($(inputs[i]).val()); i++;
		sales[q][region]['cloths'] = parseInt($(inputs[i]).val()); i++;
	});
}

RegionCategory.prototype.updateSalesCounters = function(){
	var self = this;
	var allYearKeys = Object.keys(this.sales);
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var rArr = ['east', 'west', 'north', 'south'];
	var cArr = ['automobiles', 'electronics', 'appliances', 'cloths'];
	var currYearKey = this.getCurrentSalesYearKey();
	var total = 0;
	var currYear = 0;

	allYearKeys.forEach(function(y){
		qArr.forEach(function(q){
			rArr.forEach(function(r){
				cArr.forEach(function(c){
					total += self.sales[y][q][r][c];
					if(currYearKey === y)
						currYear += self.sales[y][q][r][c];
				});
			});
		});
	});

	$('#totalCnt').text('Total sales : ' + total);
	$('#yearCnt').text('Current year sales : ' + currYear);
}

RegionCategory.prototype.getSaveJson = function(){
	return this.sales;
}

RegionCategory.prototype.getInputControlsForRegion = function(region){
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

RegionCategory.prototype.getDefaultValuesForSalesYear = function(){
	var sale = {};
	sale = {
		q1 : {
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