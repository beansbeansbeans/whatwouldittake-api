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
var createMessage = require('./createMessage');
var anonymousNamer = require('./anonymousNamer');
var roomInfo = require('./roomInfo');
var inviteCTA = require('./inviteCTA');
var squares = require('./squares');
var room = {};
var dimensions = {};
var chatters = [];
var messages = [];
var tree;
var rootNode;

var resizeHandler = () => {
  dimensions.containerHeight = d.gbID("virtual-dom-container").offsetHeight;
  dimensions.roomInfoHeight = d.gbID('room-info').offsetHeight;
  dimensions.createMessageHeight = d.qs('.create-message-wrapper').offsetHeight;
  gridHelpers.updateFrame();
  updateState();
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

var postRenderHook = _.once(resizeHandler);

var updateState = () => {
  var newTree = render();
  var patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
  postRenderHook();
};

var render = () => {
  var onlineChatters = chatters.filter(online);

  return h('div.room',
    [squares(onlineChatters),
    roomInfo.render(room, onlineChatters),
    h('ul.messages', {
      style: {
        height: (dimensions.containerHeight - (dimensions.roomInfoHeight + dimensions.createMessageHeight)) + "px"
      }
    } , messages.sort((a, b) => {
      if(a.createdAt < b.createdAt) {
        return -1;
      } else if(a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    }).map((msg) => {
      var avatarURL, author = chatters.filter(x => x._id === msg.user._id)[0];

      if(author) { avatarURL = author.avatarURL; }

      return h('li.message', 
        [h('div.avatar', {
          style: {
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
    createMessage.render(),
    anonymousNamer.render(),
    inviteCTA.render()]
  );
};

module.exports.initialize = () => {
  tree = render();
  rootNode = createElement(tree);
  d.gbID('virtual-dom-container').appendChild(rootNode);

  roomInfo.initialize();
  createMessage.initialize();
  inviteCTA.initialize();
  anonymousNamer.initialize();

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
    resizeHandler();

    if(room.creator) {
      auth.getAvatar(room.creator.facebookId, (result) => {
        room.creator.avatarURL = result;
        resizeHandler();
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

  window.addEventListener("click", (e) => {
    mediator.publish("window_click", e);
    updateState();
  });
};
