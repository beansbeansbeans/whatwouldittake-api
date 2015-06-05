var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;

module.exports = Auth;

function Auth (app, sessionStore) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var users = client.collection('users');
}