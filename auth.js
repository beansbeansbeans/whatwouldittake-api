var passport = require('passport');
var FBStrategy = require('passport-facebook').Strategy;

module.exports = Auth;

function Auth (app, sessionStore) {
  var config = app.get('config');
  var client = app.get('mongoClient');
  var users = client.collection('users');

  // passport.serializeUser(function(user, done) {
  //   console.log("SERIALIZING USER");
  //   done(null, user.id);
  // });

  // passport.deserializeUser(function(id, done) {
  //   console.log("DESERIALIZING USER");
  //   users.findOne({id: id}).then(function(user) {
  //     console.log("FOUND MATCHING USER");
  //     done(null, user);
  //   });
  // });

  // passport.use(new FBStrategy({
  //   clientID: config.auth['facebook-local'].clientid,
  //   clientSecret: config.auth['facebook-local'].clientsecret,
  //   callbackURL: config.auth['facebook-local'].callbackURL
  // },
  // function(accessToken, refreshToken, profile, done) {
  //   console.log("GOT FACEBOOK STUFF BACK");
  //   // console.log(profile);
  //   users.findOne({facebookId: profile.id}).then(function(user) {
  //     if(user) {
  //       console.log("THIS USER EXISTS");
  //       console.log(user);
  //       console.log(done.toString());
  //       done(null, user);
  //     } else {
  //       console.log("CREATING NEW USER");
  //       console.log(users);

  //       var user = {
  //         facebookId: profile.id,
  //         facebookToken: accessToken,
  //         facebookName: profile.name.givenName + ' ' + profile.name.familyName
  //       };
  //       console.log(user);
  //       return users.insert(user).then(function(user) {
  //         console.log("INSERTED USER");
  //         console.log(user);
  //         return done(null, user);
  //       });
  //     }
  //   });
  // }));
}