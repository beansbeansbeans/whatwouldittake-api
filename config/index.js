var express = require('express');
var mongojs = require('mongojs');
var pmongo = require('promised-mongo');
var path = require('path');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('client-sessions');
var hbs = require('hbs');
var fs = require('fs');

module.exports = Config;

function Config(app, mongoStore) {
  config = require('./config.json');

  app.set('config', config);

  app.set('mongoURL', config.mongoURL);

  var mongoClient = mongojs(app.get('mongoURL'), [], { authMechanism : 'ScramSHA1' });

  app.set('mongoClient', mongoClient);

  app.use(cookieParser(app.get("config").session.secret));

  app.use(session({
    cookieName: 'session',
    secret: app.get('config').session.secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  }));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:5000', 'https://whatwouldittake.cc'];
    if(allowedOrigins.indexOf(req.headers.origin) !== -1) {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Credentials', true);
      res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
      next();
    }
  });

}