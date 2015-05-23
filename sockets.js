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
    var roomID = socket.request.prattle.room,
      updateRoomOnline = function(record, amount) {
        client.collection('rooms').update({
          key: roomID
        }, {
          $inc: { online: amount }
        }, function(err, count) {
          var newCount;
          if(!err) {
            client.collection('rooms').find({key: roomID}, function(nestedError, records) {
              if(!err && records.length) {
                newCount = records[0].online;
                io.sockets.in(roomID).emit('user update', {
                  count: newCount
                });
              }
            });
          }
        });
      };
    
    socket.join(roomID);

    validateRoomExists(roomID, function(record) {
      updateRoomOnline(record, 1);
    });

    socket.on('my msg', function(data) {

    });

    socket.on('disconnect', function() {
      validateRoomExists(roomID, function(record) {
        updateRoomOnline(record, -1);
      });
    });
  });
}
