var express = require('express');
var path = require('path');
var utils = require('../utils');

module.exports = Routes;

function Routes (app) {
  var config = app.get('config');
  var client = app.get('mongoClient');

  app.get('/', function(req, res, next) {
    utils.getPublicRoomsInfo(client, function(rooms) {
      res.locals = {
        rooms: rooms
      };

      res.render('index');
    });
  });

  app.post('/create', function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
      utils.createRoom(req, res, client);
    });
  });

  app.get('/:id', function(req, res) {
    utils.getRoomInfo(req, res, client, function(room) {
      utils.getUsersInRoom(req, res, client, room, function(users) {
        utils.enterRoom(req, res, room, users);
      });
    });
  });
}