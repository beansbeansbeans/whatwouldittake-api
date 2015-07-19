var h = require('virtual-dom/h');
var sharedStorage = require('../shared/sharedStorage');
var sw = require('../socket');
var mediator = require('../shared/mediator');

var sendMsg = () => {
  var msg = d.gbID("create-message-text").value;

  sw.socket.emit('my msg', { msg: msg });

  d.gbID("create-message-text").value = "";
};

module.exports = {
  initialize() {
    mediator.subscribe("window_click", (e) => {
      if(e.target.getAttribute("id") === "send-message-button") {
        sendMsg();
      }
    });
  },
  render() {
    var currentUser, currentUserObj = sharedStorage.get('user');

    if(currentUserObj) {
      currentUser = h('div#current-user', [
        h('div.avatar', {
          style: {
            backgroundImage: 'url(' + currentUserObj.avatarURL + ')'
          }
        })
      ]);
    }

    return h('div.create-message-wrapper', [
      currentUser,
      h('textarea#create-message-text', { type: "text" }),
      h('div#send-message-button.button', 'send')
    ]);
  }
};