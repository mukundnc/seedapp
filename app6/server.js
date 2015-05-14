var antlr4 = require('antlr4/index');
var QueryListener = require('./queryListener');
var QueryLexer = require('./salesLexer').salesLexer;
var QueryParser = require('./salesParser').salesParser;

var input = "";


function onExitQuery(queryParams){
	console.log(queryParams);
}

// input = "show automobiles in north"; 	executeQuery(input);
// input = "show automobiles in up"; 		executeQuery(input);
// input = "show automobiles in mumbai";   executeQuery(input);

// input = "show cars in north"; 			executeQuery(input);
// input = "show cars in up"; 				executeQuery(input);
// input = "show cars in mumbai";  		executeQuery(input);

// input = "show bmw in north"; 			executeQuery(input);
// input = "show bmw in up"; 				executeQuery(input);
// input = "show bmw in mumbai";  			executeQuery(input);

// input = "show iphone1 in north"; 		executeQuery(input);
// input = "show iphone1 in up";  			executeQuery(input);
// input = "show iphone1 in mumbai"; 		executeQuery(input);

input = "show apple in mah where region = north and state = mah and (city != mumbai and city != pune) and brand=apple and model = iphone5";			executeQuery(input);

function executeQuery(query){
	var chars = new antlr4.InputStream(query);
	var lexer = new QueryLexer(chars);
	var tokens  = new antlr4.CommonTokenStream(lexer);
	var parser = new QueryParser(tokens);
	parser.buildParseTrees = true;
	var tree = parser.query();

	var queryListener = new QueryListener(onExitQuery);

	antlr4.tree.ParseTreeWalker.DEFAULT.walk(queryListener, tree);	
}