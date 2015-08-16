var bcrypt = require('bcryptjs');
var ObjectId = require('mongojs').ObjectId;

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