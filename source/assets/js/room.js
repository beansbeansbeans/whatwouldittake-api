var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    console.log("USER UPDATE");
    console.log(data);
  });
};