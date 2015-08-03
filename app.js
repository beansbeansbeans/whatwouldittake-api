var express = require('express');
var app = exports.app = express();
var path = require('path');
var http = require('http').Server(app);
var port = process.env.PORT || 5500;
var EventEmitter = require("events").EventEmitter;
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var ee = new EventEmitter();

require('./config')(app, mongoStore);

require('./routes')(app, ee);

exports.server = require('http').createServer(app).listen(port, function() {
  console.log('Storiesof API started on port %d', port);
});

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});
