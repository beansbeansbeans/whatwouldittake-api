var util = require('./util');
var socket = io.connect("", {
  "connect timeout": 1000
});

socket.on('user update', function(data) {
  console.log("USER UPDATE");
  console.log(data);
});

socket.on('error', function (reason){
  console.error('Unable to connect Socket.IO', reason);
});

socket.on('connect', function (){
  console.info('successfully established a working connection');
});

socket.on('rooms update', function(data) {
  var template = data.reduce(function(prev, curr) {
    return prev + util.processTemplate(curr, 'room_partial');
  }, '');

  document.querySelector('.rooms').innerHTML = template;
});