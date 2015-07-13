var express = require('express');
var app = exports.app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var EventEmitter = require("events").EventEmitter;
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var ee = new EventEmitter();

var killRoomTimers = {};

require('./config')(app, mongoStore);

require('./auth')(app);

require('./routes')(app, ee);

exports.server = require('http').createServer(app).listen(port, function() {
  console.log('Prattle started on port %d', port);
});

require('./sockets')(app, exports.server, ee);

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});

ee.on("room online update", function(data) {
  if(!data.count) {
    killRoomTimers[data.key] = setTimeout(function() {
      app.get('mongoClient').collection('rooms').remove({key: data.key}, 1);
      delete killRoomTimers[data.key];
      ee.emit("room deleted");
    }, 1000 * 60 * 30); // kill in 30 min - 
  } else {
    if(killRoomTimers[data.key]) {
      clearTimeout(killRoomTimers[data.key]);
      delete killRoomTimers[data.key];
    }
  }
});


