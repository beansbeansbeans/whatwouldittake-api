var ObjectId = require('mongojs').ObjectId;

exports.createUser = function(req, res, client, cb) {

  client.find({ 
    username: req.body.username, 
    email: req.body.email
  }).toArray().then(function(record) {
    if(record.length) {
      console.log("USER ALREADY EXISTS");
      return;      
    }
    client.insert({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(cb);    
  });

}