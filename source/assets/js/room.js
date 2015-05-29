var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    document.querySelector('.room-count').innerHTML = data.count;
  });
};