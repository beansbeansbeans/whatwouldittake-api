var express = require('express');
var path = require('path');
var utils = require('../utils');

module.exports = Routes;

function Routes (app) {
  var config = app.get('config');
  var client = app.get('mongoClient');

  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.post('/create', function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
      utils.createRoom(req, res, client);
    });
  });
}