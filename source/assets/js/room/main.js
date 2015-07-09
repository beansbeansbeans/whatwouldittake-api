var util = require('../shared/util');
var sw = require('../socket');
var auth = require('../shared/auth');
var mediator = require('../shared/mediator');
var sharedStorage = require('../shared/sharedStorage');
var gridHelpers = require('./gridHelpers');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var lastCoordinatesSize = 0;
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

var coordinateAssigner = (coordinates, refresh) => {
  var usedIndexes = [];
  return (x) => {
    if(refresh || typeof x.coordinateID === "undefined") {
      var index = 0;

      while(usedIndexes.indexOf(index) !== -1) {
        index = Math.round(Math.random() * coordinates.length);
      }

      usedIndexes.push(index);
      x.coordinateID = index;
    } else {
      usedIndexes.push(x.coordinateID);
    }
  }
};

var lacksCoordinate = x => typeof x.coordinateID === "undefined";

var render = () => {
  var anonymousNamer, 
    squareSize = gridHelpers.getSquareSize(),
    coordinates = gridHelpers.getCoordinates(),
    onlineChatters = chatters.filter(val => val.online === true ),
    assigner = coordinateAssigner(coordinates),
    minTop = Math.min.apply(Math, _.pluck(coordinates, 'top')) - squareSize / 2,
    minLeft = Math.min.apply(Math, _.pluck(coordinates, 'left')) - squareSize / 2;

  if(coordinates.length !== lastCoordinatesSize) {
    assigner = coordinateAssigner(coordinates, true);
    onlineChatters.forEach(assigner);
  } else if(onlineChatters.filter(lacksCoordinate).length) {
    onlineChatters.forEach(assigner);
  }

  lastCoordinatesSize = coordinates.length;

  if(!sharedStorage.get('user')) {
    anonymousNamer = h('div#create-name', [
        h('div.instruction', 'give yourself a name'),
        h('input', { type: "text" }),
        h('button', 'change name')
      ]);
  }

  return h('div',
    [anonymousNamer,
    h('ul.users', {
      style: {
        textAlign: 'center'
      }
    }, onlineChatters.map((val) => {
      return h('li.user', {
        style: {
          backgroundImage: 'url(' + val.avatarURL + ')'
        }
      }, val.name);
    })),
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
        h('div.contents', msg.message.msg)
      ]);
    })),
    h('div.squares-container', {
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
      }

      return h('div.square', attributes, contents)
    }))]
  );
};

module.exports.initialize = () => {
  tree = render();
  rootNode = createElement(tree);
  d.qs('.room').appendChild(rootNode);

  window.addEventListener("resize", _.debounce(resizeHandler, 300));

  mediator.subscribe("AUTH_STATUS_CHANGE", updateState);

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

    gridHelpers.updateChattersCount(chatters.filter(online).length);

    chatters.filter(authenticated).forEach(getAvatar);

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
