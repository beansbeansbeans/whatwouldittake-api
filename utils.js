var bcrypt = require('bcryptjs');
var ObjectId = require('mongojs').ObjectId;

var async = function(tasks, callback) {
  var count = 0, n = tasks.length;

  function complete() {
    count += 1;
    if (count === n) {
      callback();
    }
  }

  tasks.forEach(function (task) {
    task(complete);
  });
};

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

exports.findIssues = function(req, res, client, cb) {
  client.find().toArray(function(err, records) {
    if(records) {
      cb({ 
        success: true,
        records: records
      });
    } else {
      cb({ success: false });
    }
  });
}

exports.vote = function(req, res, issues, users, cb) {
  users.findAndModify({
    query: { _id: req.user._id.valueOf() },
    update: {
      $push: { stands: req.body.id }
    },
    new: true
  }, function(err, record) {
    if(err) {
      return cb({ success: false });
    }

    cb({
      success: true,
      record: record
    });      
  });
}

exports.getUser = function(req, res, usersClient, storiesClient, cb) {
  var stories = [], likes = [];

  usersClient.findOne({
    _id: req.user._id.valueOf()
  }, function(err, user) {
    async(user.likes.map(function(d) {
      return function(done) {
        storiesClient.findOne({ _id: d }, function(err, record) {
          if(record) { likes.push(record); }
          done();
        });
      }
    }).concat(user.stories.map(function(d) {
      return function(done) {
        storiesClient.findOne({ _id: d }, function(err, record) {
          if(record) { stories.push(record); }
          done();
        });
      }
    })), function() {
      cb({
        success: true,
        record: {
          stories: stories,
          likes: likes
        }
      });
    })
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
      password: hash,
      stands: []
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