var express = require('express');
var mongojs = require('mongojs');
var path = require('path');

module.exports = Config;

function Config(app) {
  config = require('./config.json');

  app.set('config', config);

  app.set('mongoURL', config.mongoURL);

  var mongoClient = mongojs.connect(app.get('mongoURL'));

  app.set('mongoClient', mongoClient);

  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.set('views', path.join(__dirname, '..', '/views/'));

  app.use(express.static(path.join(__dirname, '..', '/public')));
}