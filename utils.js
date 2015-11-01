var bcrypt = require('bcryptjs');
var ObjectId = require('mongojs').ObjectId;
var _ = require('underscore');

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

var cleanPostVote = function(condition, req) {
  condition.dependents = condition.dependents.filter(function(dependent) {
    return dependent.id === req.user._id.valueOf();
  });
  condition.proofs = condition.proofs.map(function(proof) {
    proof.believers = proof.believers.filter(function(believer) {
      return believer === req.user._id.valueOf();
    });
    return proof;
  });
}

var cleanDependentsPostVote = function(req, res, issues, users, cb, record) {
  var stand = 'aff';
  if(req.body.stand === 'aff') {
    stand = 'neg';
  }
  issues.findOne(
    { _id: ObjectId(req.body.id )}, function(err, issueRecord) {
    var doc = issueRecord;
    doc.conditions[stand].forEach(function(d) {
      cleanPostVote(d, req);
    });

    var set = {};
    set.conditions = doc.conditions;

    issues.findAndModify({
      query: { _id: ObjectId(req.body.id) },
      update: { $set: set },
      new: true
    }, function(err, nestedRecord) {
      cb({
        success: true,
        record: {
          user: record,
          issue: nestedRecord
        }
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
    sources: req.body.sources,
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
    description: req.body.description,
    believers: []
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

exports.convincedByProof = function(req, res, issues, users, cb) {
  var user, issue;
  var stand = 'aff';
  if(req.body.stand === 'aff') {
    stand = 'neg';
  }

  async([function(done) {
    users.findAndModify({
      query: { 
        _id: req.user._id.valueOf(),
        "stands.id": req.body.id
      },
      update: {
        $set: {
          "stands.$.stand": stand,
          "stands.$.previous": {
            conditionID: req.body.conditionID,
            proofID: req.body.proofID
          }
        }
      },
      new: true
    }, function(err, record) {
      user = record;
      done();
    });
  }, function(done) {
    issues.findOne({
      _id: ObjectId(req.body.id)
    }, function(err, record) {
      var doc = record;

      doc.conditions[req.body.stand].forEach(function(condition) {
        if(condition._id == req.body.conditionID) {
          condition.dependents = condition.dependents.map(function(d) {
            if(d.id == req.user._id.toString()) {
              d.status = "confirmed";
            }
            return d;
          });
          condition.proofs = condition.proofs.map(function(d) {
            if(d._id == req.body.proofID && d.believers.indexOf(req.user._id.valueOf()) === -1) {
              d.believers.push(req.user._id.valueOf());
            }
            return d;
          });
        }
      });

      doc.conditions[stand].forEach(function(d) {
        cleanPostVote(d, req);
      });

      var set = {};
      set['conditions'] = doc.conditions;

      issues.findAndModify({
        query: { _id: ObjectId(req.body.id) },
        update: { $set: set },
        new: true
      }, function(err, nestedRecord) {
        issue = nestedRecord;
        done();
      });
    });
  }], function() {
    cb({
      record: {
        user: user,
        issue: issue
      },
      success: true
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