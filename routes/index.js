var express = require('express');
var path = require('path');
var utils = require('../utils');

module.exports = Routes;

function Routes (app) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var roomsDB = client.collection('rooms');

  app.get('/', function(req, res, next) {
    utils.getPublicRoomsInfo(roomsDB, function(rooms) {
      res.locals = { rooms: rooms };

      res.render('index');
    });
  });

  app.post('/create', function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
      utils.createRoom(req, res, roomsDB);
    });
  });

  app.get('/:id', function(req, res) {
    utils.getRoomInfo(req, res, roomsDB, function(room) {
      if(room) {
        utils.enterRoom(req, res, room[0]);
      }
    });
  });
}