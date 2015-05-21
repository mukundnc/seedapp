
var cp = require("child_process");

function Logger(){
	this.loggerWorker = cp.fork(".//server//utils//LoggerWorker");
}

Logger.prototype.log = function(params){
	this.loggerWorker.send(params);
}

var gLogger = new Logger();

module.exports = gLogger;