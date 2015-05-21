var config = require('./../../config/config');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: config.logger.logFileName})
    ]
  });

process.on("message", function (logParams) {
    logger.log('info', logParams);
    process.send("done");
});