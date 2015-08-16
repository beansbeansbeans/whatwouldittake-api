var bcrypt = require('bcryptjs');
var ObjectId = require('mongojs').ObjectId;

var getNextSequence = function(db, name, cb) {
  db.findAndModify(
    {
      query: { _id: name },
      update: { $inc: { seq: 1 } },
      new: true,
      upsert: true
    }, function(err, record) {
      cb(record.seq);
    }
  );
}

exports.findStory = function(req, res, client, cb) {
  client.findOne({
    _id: +req.params.id
  }, function(err, record) {
    if(record) {
      cb({
        success: true,
        record: record
      });
    } else {
      cb({ success: false });
    }
  });
}

exports.createStory = function(req, res, counters, client, cb) {
  getNextSequence(counters, 'storyid', function(seq) {
    client.insert({
      _id: seq,
      hideIdentity: req.body.hideIdentity,
      user: req.user._id.valueOf(),
      entries: [
        {
          date: req.body.date,
          feeling: req.body.feeling,
          notes: req.body.notes          
        }
      ]
    }, function(err, record) {
      cb({
        success: true,
        record: record
      });
    });
  });
}

exports.createUser = function(req, res, client, cb) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  client.find({ 
    username: req.body.username, 
    email: req.body.email
  }).toArray(function(err, record) {
    if(record.length) {
      return cb({
        success: false,
        error: "User already exists"
      });      
    }

    client.insert({
      username: req.body.username,
      email: req.body.email,
      password: hash
    }, function(err, record) {
      cb({
        success: true,
        record: record
      });
    });    
  });
}

exports.findUser = function(req, res, client, cb) {
  client.findOne({
    username: req.body.username
  }, function(err, record) {
    if(record) {
      if(bcrypt.compareSync(req.body.password, record.password)) {
        cb({
          success: true,
          record: record
        });        
      } else {
        cb({
          success: false,
          error: "Invalid password."
        });  
      }
    } else {
      cb({
        success: false,
        error: "Cannot find user with that username."
      });      
    }
  });
}