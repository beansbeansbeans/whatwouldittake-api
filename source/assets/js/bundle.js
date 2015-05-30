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

  sw.socket.on('new msg', function(msg) {
    d.qs('.messages-list').innerHTML += util.processTemplate({ contents: msg}, 'message_partial');
  });

  d.gbID("send-message-button").addEventListener("click", function(e) {
    var message = d.gbID("create-message-text").value;

    sw.socket.emit('my msg', message);

    d.gbID("create-message-text").value = "";
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL2luZGV4LmpzIiwic291cmNlL2Fzc2V0cy9qcy9yb29tLmpzIiwic291cmNlL2Fzc2V0cy9qcy9zb2NrZXQuanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHN3ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcbnZhciBpbmRleCA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcbnZhciByb29tID0gcmVxdWlyZSgnLi9yb29tJyk7XG5cbndpbmRvdy5kID0gZG9jdW1lbnQ7XG5kLnFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjtcbmQucXNhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDtcbmQuZ2JJRCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkO1xuXG5zdy5pbml0aWFsaXplKCk7XG5pbmRleC5pbml0aWFsaXplKCk7XG5yb29tLmluaXRpYWxpemUoKTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHN3ID0gcmVxdWlyZSgnLi9zb2NrZXQnKTtcblxubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICBzdy5zb2NrZXQub24oJ3Jvb21zIHVwZGF0ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkLnFzKCdib2R5JykuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGluZycpO1xuXG4gICAgaWYoZGF0YS5sZW5ndGgpIHtcbiAgICAgIGQucXMoJ2JvZHknKS5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIiwgXCJvY2N1cGllZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZC5xcygnYm9keScpLnNldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiLCBcImVtcHR5XCIpO1xuICAgIH1cblxuICAgIGQucXMoJy5yb29tcycpLmlubmVySFRNTCA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgIHJldHVybiBwcmV2ICsgdXRpbC5wcm9jZXNzVGVtcGxhdGUoY3VyciwgJ3Jvb21fcGFydGlhbCcpO1xuICAgIH0sICcnKTtcbiAgfSk7XG59O1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdyA9IHJlcXVpcmUoJy4vc29ja2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgc3cuc29ja2V0Lm9uKCd1c2VyIHVwZGF0ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkLnFzKCcucm9vbS1jb3VudCcpLmlubmVySFRNTCA9IGRhdGEuY291bnQ7XG4gIH0pO1xuXG4gIHN3LnNvY2tldC5vbignbmV3IG1zZycsIGZ1bmN0aW9uKG1zZykge1xuICAgIGQucXMoJy5tZXNzYWdlcy1saXN0JykuaW5uZXJIVE1MICs9IHV0aWwucHJvY2Vzc1RlbXBsYXRlKHsgY29udGVudHM6IG1zZ30sICdtZXNzYWdlX3BhcnRpYWwnKTtcbiAgfSk7XG5cbiAgZC5nYklEKFwic2VuZC1tZXNzYWdlLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBtZXNzYWdlID0gZC5nYklEKFwiY3JlYXRlLW1lc3NhZ2UtdGV4dFwiKS52YWx1ZTtcblxuICAgIHN3LnNvY2tldC5lbWl0KCdteSBtc2cnLCBtZXNzYWdlKTtcblxuICAgIGQuZ2JJRChcImNyZWF0ZS1tZXNzYWdlLXRleHRcIikudmFsdWUgPSBcIlwiO1xuICB9KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNvY2tldDogbnVsbCxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBpby5jb25uZWN0KFwiXCIsIHtcbiAgICAgIFwiY29ubmVjdCB0aW1lb3V0XCI6IDEwMDBcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgY29uc29sZS5lcnJvcihcInVuYWJsZSB0byBjb25uZWN0IHRvIHNvY2tldC5pb1wiLCByZWFzb24pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhcImVzdGFibGlzaGVkIGN4blwiKTtcbiAgICB9KTtcbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJvY2Vzc1RlbXBsYXRlOiBmdW5jdGlvbihkYXRhLCB0ZW1wbGF0ZUlEKSB7XG4gICAgdmFyIGlkID0gdGVtcGxhdGVJRCB8fCB0aGlzLnRlbXBsYXRlSUQ7XG4gICAgcmV0dXJuIGQuZ2JJRChpZCkuaW5uZXJIVE1MLnJlcGxhY2UoL3soLio/KX0vZywgZnVuY3Rpb24ocHJvcCwgcDEpIHtcbiAgICAgIHJldHVybiAodHlwZW9mIGRhdGFbcDFdID09PSBcInVuZGVmaW5lZFwiID8gXCJcIiA6IGRhdGFbcDFdKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG59OyJdfQ==
