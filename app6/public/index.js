$(document).ready(onAppReady);

function onAppReady(){
	var antlrApp = new AntlrApp();
}

function AntlrApp(){
	this.init();
	this.initUI();
	$('.searchInput').val('show apple in north where state=pun and model=iphone5 and date >= 2010/01/1 and date <= 2012-1-1');
}

AntlrApp.prototype.initUI = function(){
	$('#results').text('');
	$('.resultsTable tbody').html('');
	

}

AntlrApp.prototype.init = function(){
	this.initUI();
	$('#run').on('click', this.executeQuery.bind(this));
	$(document).on('keypress', this.handleKeyPressEvent.bind(this));
}

AntlrApp.prototype.executeQuery = function(e){
	this.initUI();
	var query = $('.searchInput').val();
	query = encodeURIComponent(query);
	var url = '/data?q=' + query;

	$.getJSON(url, this.onDataReceived.bind(this));
}

AntlrApp.prototype.handleKeyPressEvent = function(e){
	if(e.keyCode !== 13) return;

	this.executeQuery();
}

AntlrApp.prototype.onDataReceived = function(data){
	if(data.success){
		this.showResultsTable(data.results);
	}
	else
		alert('Internal server error');
}

AntlrApp.prototype.showResultsTable = function(resp){
	var total = resp.hits.total;
	var hits = resp.hits.hits;
	var count = hits.length;
	var time = resp.took;
	$('#results').text('Showing ' + count +' of ' + total + ' results in ' + time + ' milliseconds');

	var rowHtml = '<tr>'+
			        '<td align="center">ID_PRODUCT</td>'+
			    	'<td align="center">ID_REGION</td>'+
			    	'<td align="center">ID_CUSTOMER</td>'+
			  	  '</tr>';
	var $tbody = $('.resultsTable tbody');
	hits.forEach(function(h){
		var p = h._source.product;
		var product = p.category + '-' + p.type + '-' + p.brand + '-' + p.model;
		var r = h._source.region;
		var region = r.city + '-' + r.state + ' (' + r.region + ')';
		var customer = h._source.customer.name + '-' + h._source.customer.id;

		var row = rowHtml.replace('ID_PRODUCT', product).replace('ID_REGION', region).replace('ID_CUSTOMER', customer);
		var $trow = $(row);
		$trow.appendTo($tbody);
	});

}

