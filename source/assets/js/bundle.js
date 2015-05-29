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
    document.querySelector('.room-count').innerHTML = data.count;
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
    return document.getElementById(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL2luZGV4LmpzIiwic291cmNlL2Fzc2V0cy9qcy9yb29tLmpzIiwic291cmNlL2Fzc2V0cy9qcy9zb2NrZXQuanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHN3ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcbnZhciBpbmRleCA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcbnZhciByb29tID0gcmVxdWlyZSgnLi9yb29tJyk7XG5cbnN3LmluaXRpYWxpemUoKTtcbmluZGV4LmluaXRpYWxpemUoKTtcbnJvb20uaW5pdGlhbGl6ZSgpOyIsInZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgc3cgPSByZXF1aXJlKCcuL3NvY2tldCcpO1xuXG5tb2R1bGUuZXhwb3J0cy5pbml0aWFsaXplID0gZnVuY3Rpb24oKSB7XG4gIHN3LnNvY2tldC5vbigncm9vbXMgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgIHJldHVybiBwcmV2ICsgdXRpbC5wcm9jZXNzVGVtcGxhdGUoY3VyciwgJ3Jvb21fcGFydGlhbCcpO1xuICAgIH0sICcnKTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb29tcycpLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICB9KTtcbn07XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHN3ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcblxubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBzdy5zb2NrZXQub24oJ3VzZXIgdXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb29tLWNvdW50JykuaW5uZXJIVE1MID0gZGF0YS5jb3VudDtcbiAgfSk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBzb2NrZXQ6IG51bGwsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdChcIlwiLCB7XG4gICAgICBcImNvbm5lY3QgdGltZW91dFwiOiAxMDAwXG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1bmFibGUgdG8gY29ubmVjdCB0byBzb2NrZXQuaW9cIiwgcmVhc29uKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmluZm8oXCJlc3RhYmxpc2hlZCBjeG5cIik7XG4gICAgfSk7XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb2Nlc3NUZW1wbGF0ZTogZnVuY3Rpb24oZGF0YSwgdGVtcGxhdGVJRCkge1xuICAgIHZhciBpZCA9IHRlbXBsYXRlSUQgfHwgdGhpcy50ZW1wbGF0ZUlEO1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuaW5uZXJIVE1MLnJlcGxhY2UoL3soLio/KX0vZywgZnVuY3Rpb24ocHJvcCwgcDEpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIGRhdGFbcDFdID09PSBcInVuZGVmaW5lZFwiID8gXCJcIiA6IGRhdGFbcDFdKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59OyJdfQ==
