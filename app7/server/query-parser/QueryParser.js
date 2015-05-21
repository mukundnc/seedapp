var antlr4 = require('antlr4/index');
var BailErrorStrategy = require('antlr4/error/ErrorStrategy').BailErrorStrategy;
var QueryParseListener = require('./QueryParseListener');
var Lexer = require('./antlr/generated/salesLexer').salesLexer;
var Parser = require('./antlr/generated/salesParser').salesParser;


function QueryParser(){

}

QueryParser.prototype.parse = function(query, cbOnExecuteComplete){	
	var chars = new antlr4.InputStream(query);
	var lexer = new Lexer(chars);
	var tokens  = new antlr4.CommonTokenStream(lexer);
	var parser = new Parser(tokens);
	parser._errHandler = new BailErrorStrategy();
	parser.buildParseTrees = true;

	var tree = parser.query();

	var queryListener = new QueryParseListener(cbOnExecuteComplete);

	antlr4.tree.ParseTreeWalker.DEFAULT.walk(queryListener, tree);	
}

module.exports = QueryParser;