var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var roomsDB = client.collection('rooms');
  var usersDB = client.collection('users');
  var sessionStore = app.get('sessionStore');

  app.use(function(req, res, next) {
    if(req.url === "/undefined") {
      res.end();
    } else {
      next();
    }
  });

  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.post('/create', function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
      utils.createRoom(req, res, roomsDB, ee);
    });
  });

  app.get('/rooms/:id/:format?', function(req, res) {
    if (req.params.format) { 
      utils.getRoomInfo(req, res, roomsDB, function(room) {
        res.json(room);
      });
    }
    else {
      var created = req.session.prattle && req.session.prattle.creator;

      res.locals = { creator: created };
      res.render('room');
    }
  });

  app.post('/sessions', function(req, res) {
    utils.findOrCreateUser(req.body, usersDB).then(function(record) {
      if(!req.session.prattle) {
        req.session.prattle = {};
      }

      req.session.prattle.user = record;
      res.send(record);
    });
  });
}