var express = require('express');
var mongojs = require('mongojs');
var pmongo = require('promised-mongo');
var path = require('path');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var hbs = require('hbs');
var fs = require('fs');

module.exports = Config;

function Config(app, mongoStore) {
  config = require('./config.json');

  app.set('config', config);

  app.set('mongoURL', config.mongoURL);

  var mongoClient = pmongo(app.get('mongoURL'));

  app.set('mongoClient', mongoClient);

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
}