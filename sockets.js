var sio = require('socket.io'),
  fs = require('fs');

module.exports = Sockets;

function Sockets (app, server) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var io = sio.listen(server);

  var validateRoomExists = function(id, cb) {
    client.collection('rooms').find({key: id}, function(err, records) {
      if(!err && records.length) {
        cb(records[0]);
      }
    });
  };

  io.use(function(socket, next) {
    var handshakeData = socket.request;

    handshakeData.prattle = {
      room: /\/(?:([^\/]+?))\/?$/g.exec(handshakeData.headers.referer)[1]
    };

    next();
  });

  io.sockets.on("connection", function(socket) {
    var roomID = socket.request.prattle.room;
    
    socket.join(roomID);

    validateRoomExists(roomID, function(record) {
      client.collection('rooms').update({
        key: roomID
      }, {
        $inc: { online: 1 }
      });

      io.sockets.in(roomID).emit('user update', {
        count: record.online
      });
    });

    socket.on('my msg', function(data) {

    });

    socket.on('disconnect', function() {

    });
  });
}
