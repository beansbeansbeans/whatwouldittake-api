var h = require('virtual-dom/h');
var mediator = require('../shared/mediator');
var hasDismissedInviteCTA = false;
var userIsCreator = false;

module.exports = {
  initialize() {
    if(d.gbID("session-id").textContent === "true") { userIsCreator = true; }

    mediator.subscribe("window_click", () => {
      hasDismissedInviteCTA = true;
    });
  },
  render() {
    if(userIsCreator && !hasDismissedInviteCTA) {
      return h('div#invite-cta', [
        h('div.contents', [
          h('div.text', "You're the first one here! Invite some friends. Rooms disappear 30 minutes after the last chatter has left."),
          h('div.dismiss', 'X')
        ])
      ]);
    }
  }
};