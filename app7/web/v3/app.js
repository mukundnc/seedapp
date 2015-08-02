
var gSalesAppController = null;

$(document).ready(function(){
	setViewPort();
	gSalesAppController = new SalesAppController(); 

})

function setViewPort(){	
	var availableHeight = window.innerHeight - $('.searchbar-container').height();
	$('.body-container').css('height' , (availableHeight+200) + 'px');
	var svgView = d3.selectAll('.svg-view');
	svgView.attr('width', $('.svg-container').width());
	svgView.attr('height', availableHeight);
	$('.opt-menu-icon').css('top', -($('.svg-container').height()) + 'px')
}