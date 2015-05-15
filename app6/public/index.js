$(document).ready(onAppReady);

function onAppReady(){
	var antlrApp = new AntlrApp();
}

function AntlrApp(){
	this.init();
}

AntlrApp.prototype.init = function(){
	$('#run').on('click', this.getData.bind(this));
}

AntlrApp.prototype.getData = function(e){
	var query = 'show apple in north where state=pun and model=iphone5';
	query = encodeURIComponent(query);
	var url = '/data?q=' + query;
	
	$.getJSON(url, this.onDataReceived.bind(this));
}

AntlrApp.prototype.onDataReceived = function(data){
	console.log(data);
}