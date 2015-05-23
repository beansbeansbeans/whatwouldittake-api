var sio = require('socket.io'),
  fs = require('fs');

module.exports = Sockets;

function Sockets (app, server) {
  var config = app.get('config');
  var client = app.get('mongoClient');

  var io = sio.listen(server);
}