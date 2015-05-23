var crypto = require('crypto');

exports.genRoomKey = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(Date.now().toString());
  return shasum.digest('hex').substr(0,6);
};

exports.validRoomName = function(req, res, fn) {
  req.body.room_name = req.body.room_name.trim();
  var nameLen = req.body.room_name.length;

  if(nameLen < 255 && nameLen > 0) {
    fn();
  } else {
    res.redirect('back');
  }
};

exports.createRoom = function(req, res, client) {
  var collection = client.collection('rooms'),
    roomKey = exports.genRoomKey(),
    room = {
      key: roomKey,
      name: req.body.room_name,
      online: []
    };

  collection.insert(room, function(err, record) {
    if(!err && record) {
      res.redirect("/" + roomKey);
    } else {
      res.sendStatus(500);
    }
  });
};

exports.getRoomInfo = function(req, res, client, fn) { 
  client.collection('rooms').find({key: req.params.id}, function(err, record) {
    if(!err && record.length) {
      fn(record[0])
    } else {
      res.redirect('back');
    }
  });
};

exports.getUsersInRoom = function(req, res, client, room, fn) {
  client.collection('rooms').find({key: req.params.id}, function(err, records) {
    var chatters = [];

    if(!err && records.length) {
      records[0].online.forEach(function(chatter, index) {
        chatters.push(chatter);
      });

      fn(chatters);
    }
  });
};

exports.getPublicRoomsInfo = function(client, fn) {
  client.collection('rooms').find().toArray(function(err, records) {
    var rooms = [];
    if(records.length) {
      records.forEach(function(room, index) {
        rooms.push(room);
      });

      fn(rooms);
    }
  });
};

exports.enterRoom = function(req, res, room, users){
  res.locals = {
    room: room,
    users_list: users
  };
  res.render('room');
};





