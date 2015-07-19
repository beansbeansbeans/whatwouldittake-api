var h = require('virtual-dom/h');

module.exports = function() {
  return h('div#invite-cta', [
    h('div.contents', [
      h('div.text', "You're the first one here! Invite some friends. Rooms disappear 30 minutes after the last chatter has left."),
      h('div.dismiss', 'X')
    ])
  ]);
};