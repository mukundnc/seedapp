function ESQueryBuilder(){

}

ESQueryBuilder.prototype.executeQuery = function(url, cbOnDone){
	$.getJSON(url, cbOnDone);
}