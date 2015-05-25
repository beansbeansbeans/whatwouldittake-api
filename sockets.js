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
    var handshakeData = socket.request,
      roomIdRegExp = new RegExp(handshakeData.headers.host + '/(?:([^\/]+?))\/?$', 'g'),
      roomMatch = roomIdRegExp.exec(handshakeData.headers.referer);

    handshakeData.prattle = {
      room: roomMatch ? roomMatch[1] : "lobby"
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
          client.collection('rooms').find({key: roomID}, function(nestedError, records) {
            newCount = records[0].online;

            if(newCount > 0) {
              io.sockets.in(roomID).emit('user update', {
                count: newCount
              });
            } else {
              client.collection('rooms').remove({key: roomID}, function() {
                client.collection('rooms').find().toArray(function(err, roomRecords) {

                  io.sockets.emit('rooms update', {
                    rooms: roomRecords
                  });
                });
              });
            }
          });
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
