var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var usersDB = client.collection('users');
  var countersDB = client.collection('counters');
  var issuesDB = client.collection('issues');

  app.use(function(req, res, next) {
    if(req.session && req.session.user) {
      usersDB.findOne({ username: req.session.user.username }, function(err, user) {
        if(user) {
          req.user = user;
          delete req.user.password;
          req.session.user = req.user;
        }
        next();        
      });
    } else {
      next();
    }
  });

  function requireLogin(req, res, next) {
    if(!req.user) {
      res.status(400).send({ error: 'auth failed' });
    } else {
      next();
    }
  }

  app.post('/vote', function(req, res) {
    utils.vote(req, res, issuesDB, usersDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/contribute', function(req, res) {
    utils.contribute(req, res, issuesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.get('/issues', function(req, res) {
    utils.findIssues(req, res, issuesDB, function(data) {
      if(data.success) {
        res.json(data.records);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/signup', function(req, res, next) {
    utils.createUser(req, res, usersDB, function(data) {
      if(data.success) {
        req.session.user = data.record;
        res.send({ user: data.record });
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

  app.post('/logout', function(req, res) {
    req.session.reset();
    res.sendStatus(200);
  });

  app.get('/session', function(req, res) {
    if(req.session && req.session.user){
      res.send({auth: true, id: req.session.id, user: req.session.user});
    } else {
      res.send({auth: false});
    }
  });

  app.get('/me', requireLogin, function(req, res) {
    if(req.session && req.session.user) {
      utils.getUser(req, res, usersDB, function(data) {
        if(data.success) {
          res.json(data.record);
        } else {
          res.status(400).send({ error: 'nope' });
        }
      });
    }
  });
}