function CategoryBrands(){
	this.init();
}

CategoryBrands.prototype.init = function(){
	this.addEventHandlers();
	this.getData();
}

CategoryBrands.prototype.addEventHandlers = function(){
	$('#category').on('change', this.onCategoryChange.bind(this));
	$('.binput').on('focusout', this.updateSalesObject.bind(this));
	$('#year').on('change', this.updateUI.bind(this));
}

CategoryBrands.prototype.onCategoryChange = function(){
	$('.bElecContainer').removeClass('bActive');
	$('.bApplianceContainer').removeClass('bActive');
	$('.bClothsContainer').removeClass('bActive');
	$('.bAutocontainer').removeClass('bActive');
	switch($('#category').val()){
		case 'Automobiles' : $('.bAutocontainer').addClass('bActive'); break;
		case 'Electronics' : $('.bElecContainer').addClass('bActive'); break;
		case 'Appliances' : $('.bApplianceContainer').addClass('bActive'); break;
		case 'Cloths' : $('.bClothsContainer').addClass('bActive'); break;
	}
}

CategoryBrands.prototype.getData = function(){
	var self = this;
	var options = {
		url : 'sales.txt',
		type : 'GET',
		success : function (d){
			var obj = JSON.parse(d);
			self.sales = obj.sales.category_brands;
			self.updateUI();
		},
		error: function(err){
			console.error('error in ajax');
		}
	};

	$.ajax(options);
}

CategoryBrands.prototype.updateUI = function(){
	var cYearKey = this.getCurrentSalesYearKey();

	if(!this.sales[cYearKey])
		this.sales[cYearKey] = this.getDefaultValuesForYear();
	
	var categories = ['automobiles', 'electronics', 'appliances', 'cloths'];
	
	categories.forEach((function(c){
		this.updateUIForCategory(c, this.sales[cYearKey])
	}).bind(this));
}

CategoryBrands.prototype.getCurrentSalesYearKey = function(){
	return 'c' + $('#year').val();
}

CategoryBrands.prototype.updateUIForCategory = function(category, sales){
	var inputs = this.getInputControlsForCategory(category);
	switch(category){
		case 'automobiles' : this.updateAutomobilesInputs(inputs, sales); break;
		case 'electronics' : this.updateElectronicsInputs(inputs, sales); break;
		case 'appliances' : this.updateAppliancesInputs(inputs, sales); break;
		case 'cloths' : this.updateClothsInputs(inputs, sales); break;
	}
}

CategoryBrands.prototype.updateAutomobilesInputs = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['honda', 'toyota', 'bmw', 'audi', 'mercedes', 'maruti', 'hyundai', 'fiat', 'tata', 'skoda', 'bajaj', 'hero', 'kawasaky', 'yamaha', 'suzuki' ];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			$(inputs[i]).val(sales[q]['automobiles'][b]); i++;
		});
	});	
}

CategoryBrands.prototype.updateElectronicsInputs = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['apple', 'samsung', 'micromax', 'xiome', 'nokia', 'hp', 'dell', 'asus', 'acer', 'compaq', 'lenovo'];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			$(inputs[i]).val(sales[q]['electronics'][b]); i++;
		});
	});	
}

CategoryBrands.prototype.updateAppliancesInputs = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['godrej', 'voltas', 'lg', 'sony', 'panasonic', 'toshiba', 'carrier', 'lyod', 'bluestar', 'hitachi', 'kenstar'];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			$(inputs[i]).val(sales[q]['appliances'][b]); i++;
		});
	});	
}

CategoryBrands.prototype.updateClothsInputs = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['vanhusen', 'colorplus', 'arrow', 'peterengland', 'ralphpolo', 'nike', 'addidas', 'crocodile', 'kings', 'sfk', 'levis', 'wrangler', 'stryker', 'killer', 'pepe' ];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			$(inputs[i]).val(sales[q]['cloths'][b]); i++;
		});
	});	
}

CategoryBrands.prototype.getInputControlsForCategory = function(category){
	var map = {
		'automobiles' : '.bAutoContainer input',
		'electronics' : '.bElecContainer input',
		'appliances' : '.bApplianceContainer input',
		'cloths' : '.bClothsContainer input'
	};
	var $inputs = $(map[category]);
	return $inputs;
}

CategoryBrands.prototype.updateSalesObject = function(){
	var cYearKey = this.getCurrentSalesYearKey();

	if(!this.sales[cYearKey])
		console.error('no sales object');
	
	var categories = ['automobiles', 'electronics', 'appliances', 'cloths'];
	
	categories.forEach((function(c){
		this.updateSalesObjectForCategory(c, this.sales[cYearKey])
	}).bind(this));
}

CategoryBrands.prototype.updateSalesObjectForCategory = function(category, sales){
	var inputs = this.getInputControlsForCategory(category);
	switch(category){
		case 'automobiles' : this.updateAutomobilesObjects(inputs, sales); break;
		case 'electronics' : this.updateElectronicsObjects(inputs, sales); break;
		case 'appliances' : this.updateAppliancesObjects(inputs, sales); break;
		case 'cloths' : this.updateClothsObjects(inputs, sales); break;
	}
}

CategoryBrands.prototype.updateAutomobilesObjects = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['honda', 'toyota', 'bmw', 'audi', 'mercedes', 'maruti', 'hyundai', 'fiat', 'tata', 'skoda', 'bajaj', 'hero', 'kawasaky', 'yamaha', 'suzuki' ];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			sales[q]['automobiles'][b] = $(inputs[i]).val(); i++;
		});
	});	
}

CategoryBrands.prototype.updateElectronicsObjects = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['apple', 'samsung', 'micromax', 'xiome', 'nokia', 'hp', 'dell', 'asus', 'acer', 'compaq', 'lenovo'];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			sales[q]['electronics'][b] = $(inputs[i]).val(); i++;
		});
	});	
}

CategoryBrands.prototype.updateAppliancesObjects = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['godrej', 'voltas', 'lg', 'sony', 'panasonic', 'toshiba', 'carrier', 'lyod', 'bluestar', 'hitachi', 'kenstar'];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			sales[q]['appliances'][b] = $(inputs[i]).val(); i++;
		});
	});	
}

CategoryBrands.prototype.updateClothsObjects = function(inputs, sales){
	var qArr = ['q1', 'q2', 'q3', 'q4'];
	var bArr = ['vanhusen', 'colorplus', 'arrow', 'peterengland', 'ralphpolo', 'nike', 'addidas', 'crocodile', 'kings', 'sfk', 'levis', 'wrangler', 'stryker', 'killer', 'pepe' ];
	var i = 0;
	bArr.forEach(function(b){
		qArr.forEach(function(q){
			sales[q]['cloths'][b] = $(inputs[i]).val(); i++;
		});
	});	
}

CategoryBrands.prototype.getSaveJson = function(){
	return this.sales;
}

CategoryBrands.prototype.getDefaultValuesForYear = function(){
	var sale = {
		q1 : {
			automobiles : {
				honda : 0,
				toyota : 0,
				bmw : 0,
				audi : 0,
				mercedes : 0,
				maruti : 0,
				hyundai : 0,
				fiat : 0,
				tata : 0,
				skoda : 0,
				bajaj : 0,
				hero : 0,
				kawasaky : 0,
				yamaha : 0,
				suzuki : 0
			},
			electronics : {
				apple : 0,
				samsung : 0,
				micromax : 0,
				xiome : 0,
				nokia : 0,
				hp : 0,
				dell : 0,
				asus :0,
				acer : 0,
				compaq : 0,
				lenovo : 0
			},
			appliances : {
				godrej : 0,
				voltas : 0,
				lg : 0,
				sony : 0,
				panasonic : 0,
				toshiba : 0,
				carrier : 0,
				lyod :0,
				bluestar : 0,
				hitachi : 0,
				kenstar : 0
			},
			cloths : {
				vanhusen : 0,
				colorplus : 0,
				arrow : 0,
				peterengland : 0,
				ralphpolo : 0,
				nike : 0,
				addidas : 0,
				crocodile : 0,
				kings : 0,
				sfk : 0,
				levis : 0,
				wrangler : 0,
				stryker : 0,
				killer : 0,
				pepe : 0
			}
		},
		q2 : {
			automobiles : {
				honda : 0,
				toyota : 0,
				bmw : 0,
				audi : 0,
				mercedes : 0,
				maruti : 0,
				hyundai : 0,
				fiat : 0,
				tata : 0,
				skoda : 0,
				bajaj : 0,
				hero : 0,
				kawasaky : 0,
				yamaha : 0,
				suzuki : 0
			},
			electronics : {
				apple : 0,
				samsung : 0,
				micromax : 0,
				xiome : 0,
				nokia : 0,
				hp : 0,
				dell : 0,
				asus :0,
				acer : 0,
				compaq : 0,
				lenovo : 0
			},
			appliances : {
				godrej : 0,
				voltas : 0,
				lg : 0,
				sony : 0,
				panasonic : 0,
				toshiba : 0,
				carrier : 0,
				lyod :0,
				bluestar : 0,
				hitachi : 0,
				kenstar : 0
			},
			cloths : {
				vanhusen : 0,
				colorplus : 0,
				arrow : 0,
				peterengland : 0,
				ralphpolo : 0,
				nike : 0,
				addidas : 0,
				crocodile : 0,
				kings : 0,
				sfk : 0,
				levis : 0,
				wrangler : 0,
				stryker : 0,
				killer : 0,
				pepe : 0
			}
		},
		q3 : {
			automobiles : {
				honda : 0,
				toyota : 0,
				bmw : 0,
				audi : 0,
				mercedes : 0,
				maruti : 0,
				hyundai : 0,
				fiat : 0,
				tata : 0,
				skoda : 0,
				bajaj : 0,
				hero : 0,
				kawasaky : 0,
				yamaha : 0,
				suzuki : 0
			},
			electronics : {
				apple : 0,
				samsung : 0,
				micromax : 0,
				xiome : 0,
				nokia : 0,
				hp : 0,
				dell : 0,
				asus :0,
				acer : 0,
				compaq : 0,
				lenovo : 0
			},
			appliances : {
				godrej : 0,
				voltas : 0,
				lg : 0,
				sony : 0,
				panasonic : 0,
				toshiba : 0,
				carrier : 0,
				lyod :0,
				bluestar : 0,
				hitachi : 0,
				kenstar : 0
			},
			cloths : {
				vanhusen : 0,
				colorplus : 0,
				arrow : 0,
				peterengland : 0,
				ralphpolo : 0,
				nike : 0,
				addidas : 0,
				crocodile : 0,
				kings : 0,
				sfk : 0,
				levis : 0,
				wrangler : 0,
				stryker : 0,
				killer : 0,
				pepe : 0
			}
		},
		q4 : {
			automobiles : {
				honda : 0,
				toyota : 0,
				bmw : 0,
				audi : 0,
				mercedes : 0,
				maruti : 0,
				hyundai : 0,
				fiat : 0,
				tata : 0,
				skoda : 0,
				bajaj : 0,
				hero : 0,
				kawasaky : 0,
				yamaha : 0,
				suzuki : 0
			},
			electronics : {
				apple : 0,
				samsung : 0,
				micromax : 0,
				xiome : 0,
				nokia : 0,
				hp : 0,
				dell : 0,
				asus :0,
				acer : 0,
				compaq : 0,
				lenovo : 0
			},
			appliances : {
				godrej : 0,
				voltas : 0,
				lg : 0,
				sony : 0,
				panasonic : 0,
				toshiba : 0,
				carrier : 0,
				lyod :0,
				bluestar : 0,
				hitachi : 0,
				kenstar : 0
			},
			cloths : {
				vanhusen : 0,
				colorplus : 0,
				arrow : 0,
				peterengland : 0,
				ralphpolo : 0,
				nike : 0,
				addidas : 0,
				crocodile : 0,
				kings : 0,
				sfk : 0,
				levis : 0,
				wrangler : 0,
				stryker : 0,
				killer : 0,
				pepe : 0
			}
		}
	}
	return sale;
}







