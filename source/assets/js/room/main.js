var util = require('../shared/util');
var sw = require('../socket');
var auth = require('../shared/auth');
var Immutable = require('immutable');
var chatters = Immutable.List();
var messages = Immutable.List();
var sharedStorage = require('../shared/sharedStorage');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var tree;
var rootNode;

var sendMsg = () => {
  var msg = d.gbID("create-message-text").value;

  sw.socket.emit('my msg', { msg: msg });

  d.gbID("create-message-text").value = "";
};

var updateState = () => {
  var newTree = render();
  var patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
};

var render = () => {
  return h('div.testing',
    [h('ul.users', {
      style: {
        textAlign: 'center'
      }
    }, chatters.toJS().filter(val => val.online === true ).map((val) => {
      return h('li.user', {
        style: {
          backgroundImage: 'url(' + val.avatarURL + ')'
        }
      }, val.name);
    })),
    h('ul.messages', messages.toJS().map((msg) => {
      var avatarURL, author = chatters.toJS().filter((val) => {
        return val._id === msg.user._id;
      })[0];

      if(author) { avatarURL = author.avatarURL; }

      return h('li.message', 
        [h('div.avatar', {
          style: {
            width: '40px',
            height: '40px',
            backgroundImage: 'url(' + avatarURL + ')'
          }
        }),
        h('div.contents', msg.message.msg)
      ]);
    }))]
  );
};

module.exports.initialize = () => {
  tree = render();
  rootNode = createElement(tree);
  document.body.appendChild(rootNode); 

  sw.socket.on('user update', (data) => {
    chatters = Immutable.fromJS(data.map((val, index) => {
      val.online = true;

      if(val.facebookId) {
        auth.getAvatar(val.facebookId, (result) => {
          chatters = chatters.update(index, x => x.set('avatarURL', result));
          updateState();
        });
      }

      return val;
    }));

    updateState();
  });

  sw.socket.on('new msg', (msg) => {
    messages = messages.push(msg);
    updateState();
  });

  sw.socket.on('seed messages', (msgs) => {
    if(msgs.length) {
      messages = messages.merge(msgs);
      updateState();
    }
  });

  d.gbID("send-message-button").addEventListener("click", sendMsg);
};