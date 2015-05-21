var express = require('express');
var app = new express();
var apiRouter = require('./server/routers/ApiRouter');

app.use(express.static('web'));
app.use('/api', apiRouter);

var port = 9090;
app.listen(port);
console.log('server running at port - ' + port);