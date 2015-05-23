var express = require('express');
var app = exports.app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

require('./config')(app);

require('./routes')(app);

exports.server = require('http').createServer(app).listen(port, function() {
  console.log('Prattle started on port %d', port);
});

require('./sockets')(app, exports.server);

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});