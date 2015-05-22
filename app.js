var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

require('./config')(app);

require('./routes')(app);

io.on("connection", function(socket) {
  socket.on('chat message', function(data) {
    console.log(data);
    io.emit('chat message', data);
  });
});

http.listen(port, function() {
  console.log("listening at " + port);
});