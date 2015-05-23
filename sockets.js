var sio = require('socket.io'),
  fs = require('fs');

module.exports = Sockets;

function Sockets (app, server) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var io = sio.listen(server);

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

    client.collection('rooms').find({key: roomID}, function(err, records) {
      if(!err && records.length) {
        client.collection('rooms').update({
          key: roomID
        }, {
          $inc: { online: 1 }
        });

        io.sockets.in(roomID).emit('user update', {
          count: records[0].online
        });
      }
    });

    socket.on('my msg', function(data) {

    });

    socket.on('disconnect', function() {
      console.log("DISCONNECTED");
      // remove from room.online - delete room if applicable
    });
  });
}
