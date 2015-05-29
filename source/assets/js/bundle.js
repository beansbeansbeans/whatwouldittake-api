(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sw = require('./socket');
var index = require('./index');
var room = require('./room');

sw.initialize();
index.initialize();
room.initialize();
},{"./index":2,"./room":3,"./socket":4}],2:[function(require,module,exports){
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

},{"./socket":4,"./util":5}],3:[function(require,module,exports){
var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    console.log("USER UPDATE");
    console.log(data);
  });
};
},{"./socket":4,"./util":5}],4:[function(require,module,exports){
module.exports = {
  socket: null,
  initialize: function() {
    this.socket = io.connect("", {
      "connect timeout": 1000
    });

    this.socket.on('error', function(reason) {
      console.error("unable to connect to socket.io", reason);
    });

    this.socket.on('connect', function() {
      console.info("established cxn");
    });
  }
}
},{}],5:[function(require,module,exports){
module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return document.getElementById(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL2luZGV4LmpzIiwic291cmNlL2Fzc2V0cy9qcy9yb29tLmpzIiwic291cmNlL2Fzc2V0cy9qcy9zb2NrZXQuanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgc3cgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xudmFyIGluZGV4ID0gcmVxdWlyZSgnLi9pbmRleCcpO1xudmFyIHJvb20gPSByZXF1aXJlKCcuL3Jvb20nKTtcblxuc3cuaW5pdGlhbGl6ZSgpO1xuaW5kZXguaW5pdGlhbGl6ZSgpO1xucm9vbS5pbml0aWFsaXplKCk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdyA9IHJlcXVpcmUoJy4vc29ja2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgc3cuc29ja2V0Lm9uKCdyb29tcyB1cGRhdGUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3Vycikge1xuICAgICAgcmV0dXJuIHByZXYgKyB1dGlsLnByb2Nlc3NUZW1wbGF0ZShjdXJyLCAncm9vbV9wYXJ0aWFsJyk7XG4gICAgfSwgJycpO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvb21zJykuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gIH0pO1xufTtcbiIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgc3cgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xuXG5tb2R1bGUuZXhwb3J0cy5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gIHN3LnNvY2tldC5vbigndXNlciB1cGRhdGUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgY29uc29sZS5sb2coXCJVU0VSIFVQREFURVwiKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBzb2NrZXQ6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdChcIlwiLCB7XG4gICAgICBcImNvbm5lY3QgdGltZW91dFwiOiAxMDAwXG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1bmFibGUgdG8gY29ubmVjdCB0byBzb2NrZXQuaW9cIiwgcmVhc29uKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmluZm8oXCJlc3RhYmxpc2hlZCBjeG5cIik7XG4gICAgfSk7XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJvY2Vzc1RlbXBsYXRlOiBmdW5jdGlvbihkYXRhLCB0ZW1wbGF0ZUlEKSB7XG4gICAgdmFyIGlkID0gdGVtcGxhdGVJRCB8fCB0aGlzLnRlbXBsYXRlSUQ7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5pbm5lckhUTUwucmVwbGFjZSgveyguKj8pfS9nLCBmdW5jdGlvbihwcm9wLCBwMSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgZGF0YVtwMV0gPT09IFwidW5kZWZpbmVkXCIgPyBcIlwiIDogZGF0YVtwMV0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbn07Il19
