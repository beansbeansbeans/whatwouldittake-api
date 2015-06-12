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

var getUser = () => {
  var user = {name: "anonymous"};

  if(typeof sharedStorage.get("user") !== "undefined") {
    user = sharedStorage.get("user");
  }

  return user;
};

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
    }, chatters.toJS().map((chatter) => {
      return h('li.user', {
        style: {
          backgroundImage: 'url(' + chatter.avatarURL + ')'
        }
      }, chatter.name);
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
    chatters = chatters.merge(data.map((val) => {
      val.online = true;
      return val;
    }));
    updateState();

    chatters.toJS().forEach((chatter, chatterIndex) => {
      if(chatter.facebookId && !chatter.avatarURL) {
        auth.getAvatar(chatter.facebookId, (result) => {
          chatters = chatters.update(chatterIndex, x => x.set('avatarURL', result));
          updateState();
        });
      }
    });
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