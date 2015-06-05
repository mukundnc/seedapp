function CategoryBrands(){
	this.init();
}

CategoryBrands.prototype.init = function(){
	this.addEventHandlers();
}

CategoryBrands.prototype.addEventHandlers = function(){
	$('#category').on('change', this.onCategoryChange.bind(this));
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


