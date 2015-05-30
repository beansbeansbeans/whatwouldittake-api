var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    d.qs('.room-count').innerHTML = data.count;
  });

  sw.socket.on('new msg', function(msg) {
    d.qs('.messages-list').innerHTML += util.processTemplate({ contents: msg}, 'message_partial');
  });

  d.gbID("send-message-button").addEventListener("click", function(e) {
    var message = d.gbID("create-message-text").value;

    sw.socket.emit('my msg', message);

    d.gbID("create-message-text").value = "";
  });
};