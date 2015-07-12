var util = require('../shared/util');
var api = require('../shared/api');
var sw = require('../socket');
var auth = require('../shared/auth');
var mediator = require('../shared/mediator');
var sharedStorage = require('../shared/sharedStorage');
var gridHelpers = require('./gridHelpers');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var room = {};
var chatters = [];
var messages = [];
var tree;
var rootNode;

var resizeHandler = () => {
  gridHelpers.updateFrame();
  updateState();
};

var sendMsg = () => {
  var msg = d.gbID("create-message-text").value;

  sw.socket.emit('my msg', { msg: msg });

  d.gbID("create-message-text").value = "";
};

var changeAnonymousName = () => {
  sw.socket.emit('change name', d.qs('#create-name input').value);
};

var authenticated = x => x.facebookId;

var online = x => x.online;

var getAvatar = (val) => {
  auth.getAvatar(val.facebookId, (result) => {
    if(_.findWhere(chatters, {_id: val._id})) {
      val.avatarURL = result;
      updateState();
    }
  });
};

var updateState = () => {
  var newTree = render();
  var patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
};

var render = () => {
  var anonymousNamer, creator,
    currentUser, currentUserObj = sharedStorage.get('user'),
    squareSize = gridHelpers.getSquareSize(),
    coordinates = gridHelpers.getCoordinates(),
    onlineChatters = chatters.filter(online),
    minTop = Math.min.apply(Math, _.pluck(coordinates, 'top')) - squareSize / 2,
    minLeft = Math.min.apply(Math, _.pluck(coordinates, 'left')) - squareSize / 2;

  if(!currentUserObj) {
    anonymousNamer = h('div#create-name', [
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
  } else {
    currentUser = h('div#current-user', [
      h('div.avatar', {
        style: {
          backgroundImage: 'url(' + currentUserObj.avatarURL + ')'
        }
      })
    ]);
  }

  if(room.creator) {
    creator = h('div.creator', [
      h('div.avatar', { 
        style: {
          backgroundImage: 'url(' + room.creator.avatarURL + ')'
        }
      }),
      h('span', 'created by '),
      h('div.creator-name', room.creator.name)
    ]);
  } else {
    creator = h('div.creator', 'Created anonymously ');
  }

  return h('div.room',
    [h('div.squares-container', {
      style: {
        backgroundSize: squareSize + "px " + squareSize + "px",
        backgroundPosition: minLeft + 'px ' + minTop + "px"
      }
    },
    coordinates.map((square, index) => {
      var associatedChatter = _.findWhere(onlineChatters, {coordinateID: index});
      var attributes = {
        style: {
          width: squareSize + "px",
          height: squareSize + "px",
          top: square.top + "px",
          left: square.left + "px"
        },
        dataset: { occupied: false },
        key: index
      },
      contents;

      if(associatedChatter) {
        attributes.dataset.occupied = true;
        attributes.dataset.associatedChatterId = associatedChatter._id;
        contents = associatedChatter._id;
        contents = h('div.attribution', [
          h('div.username', associatedChatter.name),
          h('div.avatar', {
            style: {
              backgroundImage: 'url(' + associatedChatter.avatarURL + ')'
            }
          })
        ]);
      }

      return h('div.square', attributes, contents)
    })),
    h('div#room-info', [
      h('div.name', room.name),
      h('div.attribution', [
        creator,
        h('div.createdAt', 'on ' + moment(room.createdAt).format('MM/D')),
        h('div.onlineCount', onlineChatters.length + ' chatting now')
      ])
    ]),
    h('ul.messages', messages.map((msg) => {
      var avatarURL, author = chatters.filter(x => x._id === msg.user._id)[0];

      if(author) { avatarURL = author.avatarURL; }

      return h('li.message', 
        [h('div.avatar', {
          style: {
            width: '40px',
            height: '40px',
            backgroundImage: 'url(' + avatarURL + ')'
          }
        }),
        h('div.contents', [
          h('div.attribution', [
            h('div.creator', msg.user.name),
            h('div.createdAt', moment(msg.createdAt).format('MMM/DD'))
          ]),
          h('div.text', msg.message.msg)
        ])
      ]);
    })),
    anonymousNamer,
    h('div.create-message-wrapper', [
      currentUser,
      h('textarea#create-message-text', { type: "text" }),
      h('div#send-message-button.button', 'send')
    ])]
  );
};

module.exports.initialize = () => {
  tree = render();
  rootNode = createElement(tree);
  d.gbID('virtual-dom-container').appendChild(rootNode);

  window.addEventListener("resize", _.debounce(resizeHandler, 300));

  mediator.subscribe("AUTH_STATUS_CHANGE", updateState);
  mediator.subscribe("AUTH_SESSION_POSTED", (data) => {
    auth.getAvatar(data.facebookId, (result) => {
      var sharedStorageUser = sharedStorage.get("user");
      sharedStorageUser.avatarURL = result;
      sharedStorage.put("user", sharedStorageUser);
      updateState();
    });
  });

  api.get('/rooms' + window.location.pathname.substring('/rooms'.length) + '/json', (err, data) => {
    room = data.data;
    updateState();

    if(room.creator) {
      auth.getAvatar(room.creator.facebookId, (result) => {
        room.creator.avatarURL = result;
        updateState();
      });
    }
  });

  var gotSeedMessages, gotSeedChatters, authors;

  var postSeedHook = _.once(() => {
    var offlineAuthors = _.uniq(chatters.concat(authors), val => val._id)
      .filter(val => val.online !== true);

    chatters = chatters.concat(offlineAuthors);
    chatters.filter(authenticated).forEach(getAvatar);

    updateState();

    gridHelpers.initialize();
  }); 

  var preload = () => {
    if(gotSeedChatters && gotSeedMessages) { postSeedHook(); }
  };

  sw.socket.on('user update', (data) => {
    chatters = _.uniq(data.concat(chatters), false, x => x._id)
      .map((val, index) => {
        if(_.findWhere(data, {_id: val._id})) {
          val.online = true;
        } else {
          val.online = false;
        }
        return val;
      });

    chatters.filter(authenticated).forEach(getAvatar);

    gridHelpers.updateChattersCount(chatters.filter(online).length);

    chatters.filter(online).forEach((x, i) => { x.coordinateID = gridHelpers.getIndices()[i] });

    updateState();

    gotSeedChatters = true;
    preload();
  });

  sw.socket.on('new msg', (msg) => {
    messages.push(msg);
    updateState();
  });

  sw.socket.on('seed messages', (msgs) => {
    if(msgs.length) {
      messages = msgs;
      updateState();
    }

    authors = _.uniq(msgs.map(val => val.user), val => val._id);

    gotSeedMessages = true;
    preload();
  });

  d.gbID("send-message-button").addEventListener("click", sendMsg);
  d.qs("#create-name button").addEventListener("click", changeAnonymousName);  
};
