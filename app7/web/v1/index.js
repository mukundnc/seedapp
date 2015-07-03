$(document).ready(onAppReady);

function onAppReady(){
	var antlrApp = new AntlrApp();
}

function AntlrApp(){
	this.init();
	$('.searchInput').val('show apple in north where date >= 2010/01/1 and date <= 2010/12/31');
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
	var url = '/api/search?q=' + query;
	var esQueryBldr = new ESQueryBuilder();
	esQueryBldr.executeQuery(url, this.onDataReceived.bind(this));
}

AntlrApp.prototype.handleKeyPressEvent = function(e){
	if(e.keyCode !== 13) return;

	this.executeQuery();
}

AntlrApp.prototype.onDataReceived = function(data){
	if(data.success){
		var consolidatedResults = this.postProcessResults(data.results);
		this.showResultsTable(consolidatedResults);
	}
	else
		alert('Internal server error');
}

AntlrApp.prototype.showResultsTable = function(resp){
	var self = this;
	var total = resp.hits.total;
	var hits = resp.hits.hits;
	var count = hits.length;
	var time = resp.took;
	$('#results').text('Showing ' + count +' of ' + total + ' results in ' + time + ' milliseconds');

	var rowHtml = '<tr>'+
			        '<td align="center">ID_PRODUCT</td>'+
			    	'<td align="center">ID_REGION</td>'+
			    	'<td align="center">ID_CUSTOMER</td>'+
			    	'<td align="center">ID_DATE</td>'+
			  	  '</tr>';
	var $tbody = $('.resultsTable tbody');
	hits.forEach(function(h){
		var p = h._source.product;
		var product = p.category + '-' + p.type + '-' + p.brand + '-' + p.model;
		var r = h._source.region;
		var region = r.city + '-' + r.state + ' (' + r.region + ')';
		var customer = h._source.customer.name + '-' + h._source.customer.id;
		var date = self.getDisplayDate(h._source.timestamp);

		var row = rowHtml.replace('ID_PRODUCT', product).replace('ID_REGION', region).replace('ID_CUSTOMER', customer).replace('ID_DATE', date);
		var $trow = $(row);
		$trow.appendTo($tbody);
	});

}

AntlrApp.prototype.postProcessResults = function(results){
	if(results.length === 1) return results[0];

	var result = results[0];
	for(var i = 1; i < results.length ; i++){
		result.hits.total += results[i].hits.total;
		result.hits.hits = result.hits.hits.concat(results[i].hits.hits);
		result.took += results[i].took;
	}
	return result;
}

AntlrApp.prototype.getDisplayDate = function(ts){
	var dt = new Date(ts);
	var day = dt.getDate();
	var month = dt.getMonth();
	var year = dt.getFullYear();
	if(day < 10) day = '0' + day;
	
	var map = {
		0 : 'Jan',
		1 : 'Feb',
		2 : 'Mar',
		3 : 'Apr',
		4 : 'May',
		5 : 'Jun',
		6 : 'Jul',
		7 : 'Aug',
		8 : 'Sep',
		9 : 'Oct',
		10 : 'Nov',
		11 : 'Dec',
	}

	return day + '-' + map[month] + '-' + year;
}






