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
      online: 0
    };

  collection.insert(room, function(err, record) {
    if(!err && record) {
      console.log("CREATED RECORD");
      res.redirect("/" + roomKey);
    } else {
      res.sendStatus(500);
    }
  });
};