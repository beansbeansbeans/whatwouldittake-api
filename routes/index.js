var express = require('express');
var path = require('path');

module.exports = Routes;

function Routes (app) {
  var config = app.get('config');
  var client = app.get('mongoClient');

  // Everything in public will be accessible from '/'
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', function(req, res, next) {
    res.render('index');
  });
}