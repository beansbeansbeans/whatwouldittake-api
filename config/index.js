var express = require('express');
var mongojs = require('mongojs');
var pmongo = require('promised-mongo');
var path = require('path');
var bodyParser  = require('body-parser');

module.exports = Config;

function Config(app) {
  config = require('./config.json');

  app.set('config', config);

  app.set('mongoURL', config.mongoURL);

  var mongoClient = pmongo(app.get('mongoURL'));

  app.set('mongoClient', mongoClient);

  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.set('views', path.join(__dirname, '..', '/views/'));

  app.use(express.static(path.join(__dirname, '..', '/public')));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
}