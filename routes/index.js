var express = require('express');
var path = require('path');
var utils = require('../utils');
var cookie = require('cookie');

module.exports = Routes;

function Routes (app, ee) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var scenariosDB = client.collection('scenarios');

  app.post('/vote', function(req, res) {
    console.log("VOTING");
  });

  app.post('/create', function(req, res) {
    utils.createScenario(req, res, scenariosDB, ee);
  });
}