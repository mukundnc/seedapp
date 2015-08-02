
// var gSalesAppController = null;

$(document).ready(function(){
	setViewPort();
	//gSalesAppController = new SalesAppController(); 

})

function setViewPort(){	
	// $('.body-container').css('height' , window.innerHeight + 'px');
	// var svg = d3.selectAll('svg');
	// svg.attr('width', $('.svg-container').width());
	// svg.attr('height', $('.svg-container').height());
	$('.opt-menu-icon').css('top', -($('.svg-container').height()) + 'px')
}