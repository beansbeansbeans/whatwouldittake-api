var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Everything in public will be accessible from '/'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.on('chat message', function(data) {
    console.log(data);
    io.emit('chat message', data);
  });
});

http.listen(3000, function() {
  console.log("listening at 3000");
});