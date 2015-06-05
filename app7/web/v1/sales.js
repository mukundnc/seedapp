$(document).ready(onAppReady);

var regionCategory = null;
var categoryBrands = null;

function onAppReady(){
	regionCategory = new RegionCategory();
	categoryBrands = new CategoryBrands();
	$('#save').on('click', save);
}

function save(){
	var rgnCatData = regionCategory.getSaveJson();
	var catBrandData = categoryBrands.getSaveJson();

	var sData = {
		sales : {
			region_category : rgnCatData,
			category_brands : catBrandData
		}
	}

	var options = {
		url : '/api/v1/save',
		type : 'POST',
		contentType : 'application/json',
		data : JSON.stringify(sData),
		success : function(res){
			console.log(res);
		},
		error : function(a,b,c){
			console.error('error in saving data');
		}
	}
	$.ajax(options);
}