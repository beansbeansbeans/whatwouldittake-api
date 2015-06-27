var api = require('./api');
var mediator = require('./mediator');
var sharedStorage = require('./sharedStorage');

function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
    FB.api('/me', function(response) {
      d.qs("#auth-container").setAttribute("data-authenticated", true);
      FB.api('/me/picture', function(result) {
        d.qs("#auth-container .avatar").style.backgroundImage = "url(" + result.data.url + ")";
      });
      api.post('/sessions', response, function(data) {
        sharedStorage.put("user", data);
        mediator.publish("AUTH_STATUS_CHANGE");
      });
    });
  } else if (response.status === 'not_authorized') {
    console.log("The person is logged into Facebook, but not your app.");
  } else {
    console.log("The person is not logged into Facebook, so we're not sure if they are logged into this app or not.");
  }

}

var initFBIntervalID = null,
  checkFBInitialized = function() {
    if(window.FBInitialized === true) {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
      d.gbID("login_button").addEventListener("click", function() {
        FB.login(statusChangeCallback);
      });
      window.clearInterval(initFBIntervalID);
    }
  },
  getFBAvatar = (id, cb) => {
    FB.api('/' + id + '/picture?type=normal', function(result) {
      if(result) {
        avatarCache[id] = result.data.url;
        cb(result.data.url);
      }
    });
  },
  avatarCache = {},
  waitingForFBToBeDefined = false,
  waitingForFBToBeDefinedIntervalID = null,
  avatarFetchQueue = [];

module.exports = {
  initialize: function() {
    initFBIntervalID = setInterval(checkFBInitialized, 100);
  },
  getAvatar: function(id, callback) {
    if(avatarCache[id]) {
      _.defer(() => { callback(avatarCache[id]); });
    } else {
      if(typeof FB !== "undefined") { 
        getFBAvatar(id, callback);
      } else {
        avatarFetchQueue.push({
          id: id,
          callback: callback
        });

        if(!waitingForFBToBeDefined) {
          waitingForFBToBeDefinedIntervalID = setInterval(() => {
            if(typeof FB !== "undefined") {
              clearInterval(waitingForFBToBeDefinedIntervalID);
              avatarFetchQueue.forEach((data) => {
                getFBAvatar(data.id, data.callback);
              });
            }
          }, 100);
          waitingForFBToBeDefined = true;
        }
      }
    }
  }
};
