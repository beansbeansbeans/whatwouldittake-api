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

var cleanDependentsPostVote = function(req, res, issues, users, cb, record) {
  var stand = 'aff';
  if(req.body.stand === 'aff') { stand = 'neg'; }

  issues.findOne(
    { _id: ObjectId(req.body.id )}, function(err, issueRecord) {
    var doc = issueRecord;
    doc.conditions[stand].forEach(function(d) {
      d.dependents = d.dependents.filter(function(dependent) {
        return dependent.id === req.user._id.valueOf();
      });
    });

    var set = {};
    set['conditions.' + stand] = doc.conditions[stand];

    issues.update(
      { _id: ObjectId(req.body.id) },
      { $set: set },
      function(err, nestedRecord) {
        cb({
          success: true,
          record: record
        });     
    });
  });

}

exports.vote = function(req, res, issues, users, cb) {
  users.findAndModify({
    query: { 
      _id: req.user._id.valueOf(),
      "stands.id": req.body.id
    },
    update: {
      $set: {
        "stands.$.stand": req.body.stand
      }
    },
    new: true
  }, function(err, record) {
    if(record) {
      cleanDependentsPostVote(req, res, issues, users, cb, record);
    } else {
      users.findAndModify({
        query: { _id: req.user._id.valueOf() },
        update: {
          $push: {
            stands: {
              id: req.body.id,
              stand: req.body.stand              
            }
          }
        }
      }, function(nestedErr, nestedRecord) {
        cleanDependentsPostVote(req, res, issues, users, cb, nestedRecord);
      });
    }
  });
}

exports.contribute = function(req, res, client, cb) {
  var push = {};
  push['conditions.' + req.body.stand] = {
    _id: new ObjectId(),
    tagline: req.body.tagline,
    moreInfo: req.body.moreInfo,
    dependents: [],
    proofs: []
  };

  client.findAndModify({
    query: { _id: ObjectId(req.body.id) },
    update: { $push: push },
    new: true
  }, function(err, record) {
    cb({
      success: true,
      record: record
    });
  });
}

exports.contributeProof = function(req, res, client, cb) {
  var query = { _id: ObjectId(req.body.id) };
  query["conditions." + req.body.stand + "._id"] = ObjectId(req.body.conditionID);
  var push = {};
  push['conditions.' + req.body.stand + '.$.proofs'] = {
    _id: new ObjectId(),
    description: req.body.description
  };

  client.findAndModify({
    query: query,
    update: { $push: push },
    new: true
  }, function(err, record) {
    cb({
      success: true,
      record: record
    });
  });
}

exports.voteOnCondition = function(req, res, client, cb) {
  var query = { _id: ObjectId(req.body.id) };
  query["conditions." + req.body.stand + "._id"] = ObjectId(req.body.conditionID);
  var push = {};
  push['conditions.' + req.body.stand + '.$.dependents'] = {
    id: req.user._id.valueOf(),
    status: "pending"
  };

  client.findAndModify({
    query: query,
    update: { $addToSet: push },
    new: true
  }, function(err, record) {
    cb({
      success: true,
      record: record
    });
  });
}

exports.getUser = function(req, res, usersClient, cb) {
  var stories = [], likes = [];

  usersClient.findOne({
    _id: req.user._id.valueOf()
  }, function(err, user) {
    cb({
      success: true,
      record: user
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