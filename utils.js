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

exports.createRoom = function(req, res, client, ee) {
  var roomKey = exports.genRoomKey(),
    room = {
      key: roomKey,
      name: req.body.room_name,
      createdAt: Date.now(),
      online: []
    };

  if(req.session.prattle) {
    room.creator = req.session.prattle.user;
  } else {
    req.session.prattle = {};
  }

  return client.insert(room).then(function(record) {
    res.locals = { creator: true };
    req.session.prattle.creator = true;
    res.redirect("/rooms/" + roomKey);
    ee.emit("room created");
  }).catch(console.log.bind(console));
};

exports.getRoomInfo = function(req, res, client, fn) { 
  return client.findOne({key: req.params.id}).then(fn)
    .catch(console.log.bind(console));
};

exports.getPublicRoomsInfo = function(client, fn) {
  return client.find().toArray().then(fn);
};

exports.findOrCreateUser = function(req, client) {
  return client.findOne({ facebookId: req.id }).then(function(user) {
    if(user) {
      return user;
    } else {
      var user = {
        facebookId: req.id,
        name: req.name
      };

      return client.insert(user);
    }
  });
};

// ON ICE

exports.getUsersInRoom = function(req, res, client, room, fn) {
  return client.collection('rooms').find({key: req.params.id}, function(err, records) {
    var chatters = [];

    if(!err && records.length) {
      records[0].online.forEach(function(chatter, index) {
        chatters.push(chatter);
      });

      fn(chatters);
    }
  });
};
