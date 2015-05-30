var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    d.qs('.room-count').innerHTML = data.count;
  });
};