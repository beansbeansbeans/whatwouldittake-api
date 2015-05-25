(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Socket.io
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vU29ja2V0LmlvXG52YXIgc29ja2V0ID0gaW8uY29ubmVjdChcIlwiLCB7XG4gIFwiY29ubmVjdCB0aW1lb3V0XCI6IDEwMDBcbn0pO1xuXG5zb2NrZXQub24oJ3VzZXIgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICBjb25zb2xlLmxvZyhcIlVTRVIgVVBEQVRFXCIpO1xuICBjb25zb2xlLmxvZyhkYXRhKTtcbn0pO1xuXG5zb2NrZXQub24oJ2Vycm9yJywgZnVuY3Rpb24gKHJlYXNvbil7XG4gIGNvbnNvbGUuZXJyb3IoJ1VuYWJsZSB0byBjb25uZWN0IFNvY2tldC5JTycsIHJlYXNvbik7XG59KTtcblxuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKCl7XG4gIGNvbnNvbGUuaW5mbygnc3VjY2Vzc2Z1bGx5IGVzdGFibGlzaGVkIGEgd29ya2luZyBjb25uZWN0aW9uJyk7XG59KTsiXX0=
