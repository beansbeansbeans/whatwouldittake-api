var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var usersDB = client.collection('users');
  var storiesDB = client.collection('stories');
  var countersDB = client.collection('counters');

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

  app.post('/signup', function(req, res, next) {
    utils.createUser(req, res, usersDB, function(data) {
      if(data.success) {
        req.session.user = data.record;
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

  app.post('/create_story', requireLogin, function(req, res) {
    utils.createStory(req, res, usersDB, countersDB, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/edit_story', requireLogin, function(req, res) {
    utils.editStory(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/delete_story', requireLogin, function(req, res) {
    utils.deleteStory(req, res, storiesDB, usersDB, function(data) {
      res.sendStatus(200);
    });
  });

  app.post('/change_story_visibility', requireLogin, function(req, res) {
    utils.editStoryVisibility(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/delete_entry', requireLogin, function(req, res) {
    utils.deleteEntry(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.get('/story/:id', function(req, res) {
    utils.findStory(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.get('/stories/:page', function(req, res) {
    utils.findStories(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.records);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/favorite_story', function(req, res) {
    utils.likeStory(req, res, storiesDB, usersDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/unfavorite_story', function(req, res) {
    utils.unlikeStory(req, res, storiesDB, usersDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.post('/search_stories_by_path', function(req, res) {
    utils.findStoriesByPath(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.records);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.get('/sample_search', function(req, res) {
    utils.findSampleStory(req, res, storiesDB, function(data) {
      if(data.success) {
        res.json(data.record);
      } else {
        res.status(400).send({ error: 'nope' });
      }
    });
  });

  app.get('/me', requireLogin, function(req, res) {
    if(req.session && req.session.user) {
      utils.getUser(req, res, usersDB, storiesDB, function(data) {
        if(data.success) {
          res.json(data.record);
        } else {
          res.status(400).send({ error: 'nope' });
        }
      });
    }
  });
}