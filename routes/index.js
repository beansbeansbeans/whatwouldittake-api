var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var usersDB = client.collection('users');

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
  });

  app.post('/signup', function(req, res) {
    utils.createUser(req, res, usersDB, function(data) {
      console.log("SUCCESS???");
      console.log(data);
      res.sendStatus(200);
    });
  });

  app.post('/login', function() {

  });

  app.post('/logout', function() {

  });
}