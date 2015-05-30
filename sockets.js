var sio = require('socket.io'),
  fs = require('fs');

module.exports = Sockets;

function Sockets (app, server, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var io = sio.listen(server);
  var getRoomsOnline = function() {
    return client.collection('rooms').find().toArray();
  };

  ee.on("room created", function() {
    getRoomsOnline().then(function(records) {
      io.sockets.in('lobby').emit('rooms update', records);
    });
  });

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
          $set: { online: amount }
        }).then(function(data) {
          client.collection('rooms').findOne({key: roomID}).then(function(record) {
            newCount = record.online;

            if(newCount > 0) {
              io.sockets.in(roomID).emit('user update', { count: newCount });
            } else {
              client.collection('rooms').remove({key: roomID})
                .then(getRoomsOnline)
                .then(function(roomRecords) {
                  io.sockets.in('lobby').emit('rooms update', roomRecords);
                });
            }
          })
        })
      };

    socket.join(roomID);

    if(roomID === "lobby") {
      getRoomsOnline().then(function(records) {
        io.sockets.connected[socket.id].emit('rooms update', records);
      });
    }

    validateRoomExists(roomID, function(record) {
      updateRoomOnline(record, Object.keys(io.nsps['/'].adapter.rooms[roomID]).length);
    });

    socket.on('my msg', function(data) {
      io.sockets.in(roomID).emit('new msg', data);
    });

    socket.on('disconnect', function() {
      var onlineCount = 0,
        roomObj = io.nsps['/'].adapter.rooms[roomID];

      if(roomObj) {
        onlineCount = Object.keys(roomObj).length;
      }

      validateRoomExists(roomID, function(record) {
        updateRoomOnline(record, onlineCount);
      });
    });
  });
}
