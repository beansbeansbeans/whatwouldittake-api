var h = require('virtual-dom/h');

module.exports = function() {
  return h('div#create-name', [
    h('div.info', [
      h('span', "You're chatting as anonymous."),
      h('button#login_button', 'Login with Facebook'),
      h('span', ' or'),
      h('div#name_change_launcher', ' change your name')
    ]),
    h('div.modal', [
      h('input', { type: "text" }),
      h('button', 'change name')
    ])
  ]);
}