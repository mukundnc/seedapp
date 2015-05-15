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
	$.getJSON('/data', this.onDataReceived.bind(this));
}

AntlrApp.prototype.onDataReceived = function(data){
	console.log(data);
}