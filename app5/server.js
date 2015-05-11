var antlr4 = require('antlr4/index');
var RowLexer = require('./rowLexer');
var RowParser = require('./rowParser');
var BaseRowListener = require('./rowListener').rowListener;


var input = "  Vish  al Shar  ma\twakad\n  Prasa  nna Deshpa  nde\tkothrud\n  Yatis  h Gu  pta\tandheri\n"
var chars = new antlr4.InputStream(input);
var lexer = new RowLexer.rowLexer(chars);
var tokens  = new antlr4.CommonTokenStream(lexer);
var parser = new RowParser.rowParser(tokens);
parser.buildParseTrees = true;
var tree = parser.file();



function RowListener(){
	BaseRowListener.call(this);
	return this;
}

RowListener.prototype = Object.create(BaseRowListener.prototype);
RowListener.prototype.constructor = RowListener;

RowListener.prototype.enterRow = function(ctx){
	console.log(ctx.getText());
}

var rowListener = new RowListener();

 antlr4.tree.ParseTreeWalker.DEFAULT.walk(rowListener, tree);
