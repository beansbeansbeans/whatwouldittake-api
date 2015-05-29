var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('rooms update', function(data) {
    var template = data.reduce(function(prev, curr) {
      return prev + util.processTemplate(curr, 'room_partial');
    }, '');

    document.querySelector('.rooms').innerHTML = template;
  });
};
