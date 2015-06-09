
var gSalesApp = null;

$(document).ready(function(){
	setViewPort();
	gSalesApp = new SalesApp(); 

})

function setViewPort(){
	wHeight = window.innerHeight;
	
	$('.body-container').css({
		'height' : wHeight + 'px'
	});

}