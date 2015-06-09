var util = require('../shared/util');
var sw = require('../socket');
var auth = require('../shared/auth');
var messages = require('./messages');
var chatters = require('./chatters');
var sharedStorage = require('../shared/sharedStorage');

var getMsgHTML = function(msg) {
  return util.processTemplate({ 
    contents: msg.msg,
    user: msg.user.name
  }, 'message_partial');
};

var getUser = function() {
  var user = {name: "anonymous"};

  if(typeof sharedStorage.get("user") !== "undefined") {
    user = sharedStorage.get("user");
  }

  return user;
};

var sendMsg = function() {
  var msg = d.gbID("create-message-text").value;

  sw.socket.emit('my msg', {
    msg: msg,
    user: getUser()
  });

  d.gbID("create-message-text").value = "";
};

module.exports.initialize = function() {

  var msgList = d.qs('.messages-list');

  sw.socket.on('user update', function(data) {
    console.log(data);
    d.qs('.room-count').innerHTML = data.count;
  });

  sw.socket.on('new msg', function(msg) {
    msgList.innerHTML += getMsgHTML(msg);
  });

  sw.socket.on('seed messages', function(msgs) {
    if(msgs.length) {
      var html = "";
      msgs.forEach(function(item) {
        html += getMsgHTML(item.message);
      });
      msgList.innerHTML += html;
    }
  });

  d.gbID("send-message-button").addEventListener("click", sendMsg);
};