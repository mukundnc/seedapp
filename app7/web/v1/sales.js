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
			if(res.success)
				alert('Data saved successfully');
			else
				alert('Failed to save data');
		},
		error : function(a,b,c){
			console.error('error in saving data');
			alert('Network error while saving data');
		}
	}
	$.ajax(options);
}