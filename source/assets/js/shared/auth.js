var api = require('./api');

function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      api.post('/sessions', response, function(data) {
        console.log("CALLBACK");
        console.log(data);
      });
    });
  } else if (response.status === 'not_authorized') {
    console.log("The person is logged into Facebook, but not your app.");
  } else {
    console.log("The person is not logged into Facebook, so we're not sure if they are logged into this app or not.");
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

var initFBIntervalID = null,
  checkFBInitialized = function() {
    if(typeof window.FB !== "undefined") {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
      window.clearInterval(initFBIntervalID);
    }
  };

module.exports = {
  initialize: function() {
    initFBIntervalID = setInterval(checkFBInitialized, 100);
  }
};
