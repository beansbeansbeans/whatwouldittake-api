var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('rooms update', function(data) {
    d.qs('body').classList.remove('loading');

    if(data.length) {
      d.qs('body').setAttribute("data-mode", "occupied");
    } else {
      d.qs('body').setAttribute("data-mode", "empty");
    }

    d.qs('.rooms').innerHTML = data.reduce(function(prev, curr) {
      return prev + util.processTemplate(curr, 'room_partial');
    }, '');
  });
};
