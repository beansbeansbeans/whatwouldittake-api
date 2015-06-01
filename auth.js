var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;

module.exports = Auth;

function Auth (app) {
  var config = app.get('config');

  if(config.auth.facebook.clientid.length) {
    passport.use(new FBStrategy({
      clientID: config.auth.facebook.clientid,
      clientSecret: config.auth.facebook.clientsecret
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }));
  }
}