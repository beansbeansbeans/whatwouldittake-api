(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sw = require('./socket');
var index = require('./index');
var room = require('./room');

window.d = document;
d.qs = document.querySelector;
d.qsa = document.querySelectorAll;
d.gbID = document.getElementById;

sw.initialize();
index.initialize();
room.initialize();
},{"./index":2,"./room":3,"./socket":4}],2:[function(require,module,exports){
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

},{"./socket":4,"./util":5}],3:[function(require,module,exports){
var util = require('./util');
var sw = require('./socket');

module.exports.initialize = function() {
  sw.socket.on('user update', function(data) {
    d.qs('.room-count').innerHTML = data.count;
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
};
},{}],5:[function(require,module,exports){
module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return d.gbID(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL2luZGV4LmpzIiwic291cmNlL2Fzc2V0cy9qcy9yb29tLmpzIiwic291cmNlL2Fzc2V0cy9qcy9zb2NrZXQuanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgc3cgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xudmFyIGluZGV4ID0gcmVxdWlyZSgnLi9pbmRleCcpO1xudmFyIHJvb20gPSByZXF1aXJlKCcuL3Jvb20nKTtcblxud2luZG93LmQgPSBkb2N1bWVudDtcbmQucXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yO1xuZC5xc2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsO1xuZC5nYklEID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQ7XG5cbnN3LmluaXRpYWxpemUoKTtcbmluZGV4LmluaXRpYWxpemUoKTtcbnJvb20uaW5pdGlhbGl6ZSgpOyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgc3cgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xuXG5tb2R1bGUuZXhwb3J0cy5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gIHN3LnNvY2tldC5vbigncm9vbXMgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgIGQucXMoJ2JvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cbiAgICBpZihkYXRhLmxlbmd0aCkge1xuICAgICAgZC5xcygnYm9keScpLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcIm9jY3VwaWVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkLnFzKCdib2R5Jykuc2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIsIFwiZW1wdHlcIik7XG4gICAgfVxuXG4gICAgZC5xcygnLnJvb21zJykuaW5uZXJIVE1MID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3Vycikge1xuICAgICAgcmV0dXJuIHByZXYgKyB1dGlsLnByb2Nlc3NUZW1wbGF0ZShjdXJyLCAncm9vbV9wYXJ0aWFsJyk7XG4gICAgfSwgJycpO1xuICB9KTtcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHN3ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcblxubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBzdy5zb2NrZXQub24oJ3VzZXIgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgIGQucXMoJy5yb29tLWNvdW50JykuaW5uZXJIVE1MID0gZGF0YS5jb3VudDtcbiAgfSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBzb2NrZXQ6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdChcIlwiLCB7XG4gICAgICBcImNvbm5lY3QgdGltZW91dFwiOiAxMDAwXG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1bmFibGUgdG8gY29ubmVjdCB0byBzb2NrZXQuaW9cIiwgcmVhc29uKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmluZm8oXCJlc3RhYmxpc2hlZCBjeG5cIik7XG4gICAgfSk7XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb2Nlc3NUZW1wbGF0ZTogZnVuY3Rpb24oZGF0YSwgdGVtcGxhdGVJRCkge1xuICAgIHZhciBpZCA9IHRlbXBsYXRlSUQgfHwgdGhpcy50ZW1wbGF0ZUlEO1xuICAgIHJldHVybiBkLmdiSUQoaWQpLmlubmVySFRNTC5yZXBsYWNlKC97KC4qPyl9L2csIGZ1bmN0aW9uKHByb3AsIHAxKSB7XG4gICAgICByZXR1cm4gKHR5cGVvZiBkYXRhW3AxXSA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiXCIgOiBkYXRhW3AxXSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxufTsiXX0=
