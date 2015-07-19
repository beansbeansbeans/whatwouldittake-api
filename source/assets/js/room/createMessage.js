var h = require('virtual-dom/h');
var sharedStorage = require('../shared/sharedStorage');

module.exports = {
  initialize() {

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