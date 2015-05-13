var antlr4 = require('antlr4/index');
var QueryListenerBase = require('./salesListener').salesListener;
var fs = require('fs');

function QueryListener(){
	QueryListenerBase.call(this);
	return this;
}

QueryListener.prototype = Object.create(QueryListenerBase.prototype);
QueryListener.prototype.constructor = QueryListener;

QueryListener.prototype.enterQuery = function(ctx){
	// console.log('inside enter query   ' +  __dirname);
	// var fileName = __dirname + '/context.txt';
	// console.log(ctx);
	// fs.writeFile(fileName, ctx, function(err, a, b){
	// 	if(!err){
	// 		console.log("File saved successfully");
	// 	}
	// });
}

QueryListener.prototype.visitTerminal = function(node) {
	//console.log(node);
};

QueryListener.prototype.enterCategory_in_region = function(ctx) {
	console.log(ctx.categorySpec().getText());
};

QueryListener.prototype.enterCategory_in_state = function(ctx) {
	console.log('instate');
};
module.exports = QueryListener;