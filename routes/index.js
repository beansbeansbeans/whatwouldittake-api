var express = require('express');
var path = require('path');

module.exports = Routes;

function Routes (app) {
  var config = app.get('config');
  var client = app.get('mongoClient');

  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.post('/create', function(req, res) {
    console.log("RECEIVED CREATE ROOM REQUEST");
    // utils.validRoomName(req, res, function(roomKey) {
    //   utils.roomExists(req, res, client, function() {
    //     utils.createRoom(req, res, client);
    //   });
    // });
  });
}