var ObjectId = require('mongojs').ObjectId;

exports.createUser = function(req, res, client, cb) {

  client.find({ 
    username: req.body.username, 
    email: req.body.email
  }).toArray().then(function(record) {
    if(record.length) {
      return cb({
        success: false,
        error: "User already exists"
      });      
    }
    client.insert({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(function(record) {
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
  }).then(function(record) {
    if(record) {
      if(req.body.password === record.password) {
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