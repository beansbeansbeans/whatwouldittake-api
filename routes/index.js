var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var usersDB = client.collection('users');

  app.post('/signup', function(req, res, next) {
    utils.createUser(req, res, usersDB, function(data) {
      if(data.success) {
        res.sendStatus(200);
      } else {
        res.status(400).send({ error: data.error });
      }
    });
  });

  app.post('/login', function(req, res) {
    utils.findUser(req, res, usersDB, function(data) {
      if(data.success) {
        req.session.user = data.record;
        res.send({
          auth: true, 
          user: req.session.user
        });
      } else {
        res.status(400).send({ error: data.error });
      }
    });
  });

  // objective: to get sessions integrated with a request to add a story to a user
  app.get('/dashboard', function(req, res) {
    if(req.session && req.session.user) {
      usersDB.findOne({ email: req.session.user.email }).then(function(user) {
        if(!user) {
          req.session.reset();
          res.status(400).send({ error: 'invalid session' });
        } else {
          res.json(user);
        }
      })
    }
  })

  app.post('/logout', function() {
    req.session.reset();
  });
}