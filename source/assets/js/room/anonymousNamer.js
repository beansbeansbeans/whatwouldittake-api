var h = require('virtual-dom/h');
var sw = require('../socket');
var mediator = require('../shared/mediator');

var changeAnonymousName = (e) => {
  if(e.target.getAttribute("id") === "create-name") {
    sw.socket.emit('change name', d.qs('#create-name input').value);
  }
};

module.exports = {
  initialize() {
    mediator.subscribe("window_click", changeAnonymousName)
  },
  render() {
    return h('div#create-name', [
      h('div.info', [
        h('span', "You're chatting as anonymous."),
        h('button#login_button', 'Login with Facebook'),
        h('span', ' or'),
        h('div#name_change_launcher', ' change your name')
      ]),
      h('div.modal', [
        h('input', { type: "text" }),
        h('button#create-name', 'change name')
      ])
    ]);
  }
};
