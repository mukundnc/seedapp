$(document).ready(onAppReady);

var regionCategory = null;
var categoryBrands = null;

function onAppReady(){
	hideLoading();
	regionCategory = new RegionCategory();
	categoryBrands = new CategoryBrands();
	$('#save').on('click', save);
	$('#build').on('click', build);
	
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
		url : '/api/strategy/save',
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

function build(){
	if(!confirm('This action will delete the existing indices.\nAre you sure you want to continue?')) return;

	showLoading();
	$.ajax({
		timeout : 1000 * 60 * 30,
		url : '/api/strategy/build',
		type : 'GET',
		success : function(res){
			hideLoading();
			alert(res.message);
		},
		error : function(a,b,c){
			hideLoading();
			alert('network error');
		}
	});
}

function showLoading(){
	var T = window.innerHeight/3 + 100;
	var L = window.innerWidth/3 + 100;
	$('#loading').css('position', 'absolute');
	$('#loading').css('top', T + 'px');
	$('#loading').css('left',L + 'px');
	$('#loading').css('width','50px');
	$('#loading').css('z-index','999');
	$('#loading').show();
}

function hideLoading(){
	$('#loading').hide();
}


