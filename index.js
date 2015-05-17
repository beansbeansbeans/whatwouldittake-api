var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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