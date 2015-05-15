var antlr4 = require('antlr4/index');
var QueryListener = require('./queryListener');
var QueryLexer = require('./salesLexer').salesLexer;
var QueryParser = require('./salesParser').salesParser;

var input = "";




function AntlrApp(){

}

AntlrApp.prototype.executeQuery = function(query, cbOnExecuteComplete){
	var chars = new antlr4.InputStream(query);
	var lexer = new QueryLexer(chars);
	var tokens  = new antlr4.CommonTokenStream(lexer);
	var parser = new QueryParser(tokens);
	parser.buildParseTrees = true;
	var tree = parser.query();

	var queryListener = new QueryListener(cbOnExecuteComplete);

	antlr4.tree.ParseTreeWalker.DEFAULT.walk(queryListener, tree);	
}

AntlrApp.prototype.runTests = function(){
	function onQueryResult(data){
		console.log(data);
	}
	input = "show automobiles in north"; 	this.executeQuery(input, onQueryResult);
	input = "show automobiles in up"; 		this.executeQuery(input, onQueryResult);
	input = "show automobiles in mumbai";   this.executeQuery(input, onQueryResult);

	input = "show cars in north"; 			this.executeQuery(input, onQueryResult);
	input = "show cars in up"; 				this.executeQuery(input, onQueryResult);
	input = "show cars in mumbai";  		this.executeQuery(input, onQueryResult);

	input = "show bmw in north"; 			this.executeQuery(input, onQueryResult);
	input = "show bmw in up"; 				this.executeQuery(input, onQueryResult);
	input = "show bmw in mumbai";  			this.executeQuery(input, onQueryResult);

	input = "show iphone1 in north"; 		this.executeQuery(input, onQueryResult);
	input = "show iphone1 in up";  			this.executeQuery(input, onQueryResult);
	input = "show iphone1 in mumbai"; 		this.executeQuery(input, onQueryResult);

	input = "show apple in mah where (city != mumbai and city != pune)";
	this.executeQuery(input, onQueryResult);

	input = "show apple in mah where region = north and state = mah or (city != mumbai and city != pune) and brand=apple or model = iphone5 ";			
	this.executeQuery(input, onQueryResult);
}

var antlrApp = new AntlrApp();

module.exports = antlrApp;








