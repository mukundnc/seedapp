
var gSalesApp = null;

$(document).ready(function(){
	setViewPort();
	gSalesApp = new SalesApp(); 

})

function setViewPort(){	
	$('.body-container').css('height' , window.innerHeight + 'px');
	var svg = d3.selectAll('svg');
	svg.attr('width', $('.svg-container').width());
	svg.attr('height', $('.svg-container').height());
}