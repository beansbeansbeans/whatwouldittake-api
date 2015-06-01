var express = require('express');
var app = exports.app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var EventEmitter = require("events").EventEmitter;

var ee = new EventEmitter();

require('./config')(app);

require('./auth')(app);

require('./routes')(app, ee);

exports.server = require('http').createServer(app).listen(port, function() {
  console.log('Prattle started on port %d', port);
});

require('./sockets')(app, exports.server, ee);

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});