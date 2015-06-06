var util = require('../shared/util');
var sw = require('../socket');
var sharedStorage = require('../shared/sharedStorage');

var getMsgHTML = function(msg) {
  return util.processTemplate({ 
    contents: msg.msg,
    user: msg.user.name
  }, 'message_partial');
};

module.exports.initialize = function() {
  var msgList = d.qs('.messages-list');

  sw.socket.on('user update', function(data) {
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

  d.gbID("send-message-button").addEventListener("click", function(e) {
    var msg = d.gbID("create-message-text").value,
      user = {name: "anonymous"};

    if(typeof sharedStorage.get("user") !== "undefined") {
      user = sharedStorage.get("user");
    }

    sw.socket.emit('my msg', {
      msg: msg,
      user: user
    });

    d.gbID("create-message-text").value = "";
  });
};