//Socket.io
var socket = io.connect("", {
  "connect timeout": 1000,
  "room": 'testing'
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