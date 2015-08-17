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

exports.createStory = function(req, res, users, counters, client, cb) {
  getNextSequence(counters, 'storyid', function(seq) {

    users.findOne({
      _id: req.user._id.valueOf()
    }, function(err, userRecord) {
      client.insert({
        _id: seq,
        hideIdentity: req.body.hideIdentity,
        user: {
          _id: userRecord._id,
          username: userRecord.username
        },
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
  });
}

exports.createUser = function(req, res, client, cb) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  client.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  }, function(err, record) {
    if(record) {
      var error = {
        field: 'email',
        message: "A user with that email address already exists."
      };
      if(record.username === req.body.username) {
        error = {
          field: 'username',
          message: "That username has been taken."
        };
      }

      return cb({
        success: false,
        error: error
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
    $or: [
      { username: req.body.username },
      { email: req.body.username }
    ]
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
          error: {
            field: 'password',
            message: 'Invalid password.'
          }
        });  
      }
    } else {
      cb({
        success: false,
        error: {
          field: 'username',
          message: "Sorry, we couldn't find anyone with that username or password."
        }
      });      
    }
  });
}