var h = require('virtual-dom/h');
var sw = require('../socket');
var mediator = require('../shared/mediator');
var sharedStorage = require('../shared/sharedStorage');
var modalOpen = false;

var changeAnonymousName = () => {
  sw.socket.emit('change name', d.qs('#create-name-wrapper input').value);
  closeModal();
};

var launchModal = () => { modalOpen = true; }

var closeModal = () => { modalOpen = false; }

module.exports = {
  initialize() {
    mediator.subscribe("window_click", (e) => {
      var id = e.target.getAttribute("id");
      if(id === "create-name") {
        changeAnonymousName();
      } else if(id === "name_change_launcher") {
        launchModal();
      } else if(id === "name_change_modal_mask") {
        closeModal();
      }
    });
  },
  render() {
    if(!sharedStorage.get('user')) {
      return h('div#create-name-wrapper', [
        h('div.info', [
          h('span', "You're chatting as anonymous."),
          h('button#login_button', 'Login with Facebook'),
          h('span', ' or'),
          h('div#name_change_launcher', ' change your name')
        ]),
        h('div#name_change_modal', {
            dataset: { open: modalOpen }
          }, [
          h('div#name_change_modal_mask'),
          h('div.contents', [
            h('input', { type: "text" }),
            h('button#create-name', 'change name')
          ])
        ])
      ]);
    }
  }
};
