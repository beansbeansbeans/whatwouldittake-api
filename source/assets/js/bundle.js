(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./util":2}],2:[function(require,module,exports){
module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return document.getElementById(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoXCJcIiwge1xuICBcImNvbm5lY3QgdGltZW91dFwiOiAxMDAwXG59KTtcblxuc29ja2V0Lm9uKCd1c2VyIHVwZGF0ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgY29uc29sZS5sb2coXCJVU0VSIFVQREFURVwiKTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG59KTtcblxuc29ja2V0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChyZWFzb24pe1xuICBjb25zb2xlLmVycm9yKCdVbmFibGUgdG8gY29ubmVjdCBTb2NrZXQuSU8nLCByZWFzb24pO1xufSk7XG5cbnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpe1xuICBjb25zb2xlLmluZm8oJ3N1Y2Nlc3NmdWxseSBlc3RhYmxpc2hlZCBhIHdvcmtpbmcgY29ubmVjdGlvbicpO1xufSk7XG5cbnNvY2tldC5vbigncm9vbXMgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgdGVtcGxhdGUgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXJyKSB7XG4gICAgcmV0dXJuIHByZXYgKyB1dGlsLnByb2Nlc3NUZW1wbGF0ZShjdXJyLCAncm9vbV9wYXJ0aWFsJyk7XG4gIH0sICcnKTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucm9vbXMnKS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBwcm9jZXNzVGVtcGxhdGU6IGZ1bmN0aW9uKGRhdGEsIHRlbXBsYXRlSUQpIHtcbiAgICB2YXIgaWQgPSB0ZW1wbGF0ZUlEIHx8IHRoaXMudGVtcGxhdGVJRDtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLmlubmVySFRNTC5yZXBsYWNlKC97KC4qPyl9L2csIGZ1bmN0aW9uKHByb3AsIHAxKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiBkYXRhW3AxXSA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiXCIgOiBkYXRhW3AxXSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufTsiXX0=
