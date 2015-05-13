var antlr4 = require('antlr4/index');
var QueryListener = require('./queryListener');
var QueryLexer = require('./salesLexer').salesLexer;
var QueryParser = require('./salesParser').salesParser;

var input = "show automobiles in north";
var chars = new antlr4.InputStream(input);
var lexer = new QueryLexer(chars);
var tokens  = new antlr4.CommonTokenStream(lexer);
var parser = new QueryParser(tokens);
parser.buildParseTrees = true;
var tree = parser.query();

var queryListener = new QueryListener();

antlr4.tree.ParseTreeWalker.DEFAULT.walk(queryListener, tree);