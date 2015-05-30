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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiLCJzb3VyY2UvYXNzZXRzL2pzL2luZGV4LmpzIiwic291cmNlL2Fzc2V0cy9qcy9yb29tLmpzIiwic291cmNlL2Fzc2V0cy9qcy9zb2NrZXQuanMiLCJzb3VyY2UvYXNzZXRzL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBzdyA9IHJlcXVpcmUoJy4vc29ja2V0Jyk7XG52YXIgaW5kZXggPSByZXF1aXJlKCcuL2luZGV4Jyk7XG52YXIgcm9vbSA9IHJlcXVpcmUoJy4vcm9vbScpO1xuXG53aW5kb3cuZCA9IGRvY3VtZW50O1xuZC5xcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I7XG5kLnFzYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw7XG5kLmdiSUQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZDtcblxuc3cuaW5pdGlhbGl6ZSgpO1xuaW5kZXguaW5pdGlhbGl6ZSgpO1xucm9vbS5pbml0aWFsaXplKCk7IiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdyA9IHJlcXVpcmUoJy4vc29ja2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgc3cuc29ja2V0Lm9uKCdyb29tcyB1cGRhdGUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgZC5xcygnYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKTtcblxuICAgIGQucXMoJy5yb29tcycpLmlubmVySFRNTCA9IGRhdGEucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgIHJldHVybiBwcmV2ICsgdXRpbC5wcm9jZXNzVGVtcGxhdGUoY3VyciwgJ3Jvb21fcGFydGlhbCcpO1xuICAgIH0sICcnKTtcbiAgfSk7XG59O1xuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBzdyA9IHJlcXVpcmUoJy4vc29ja2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgc3cuc29ja2V0Lm9uKCd1c2VyIHVwZGF0ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBkLnFzKCcucm9vbS1jb3VudCcpLmlubmVySFRNTCA9IGRhdGEuY291bnQ7XG4gIH0pO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc29ja2V0OiBudWxsLFxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QoXCJcIiwge1xuICAgICAgXCJjb25uZWN0IHRpbWVvdXRcIjogMTAwMFxuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQub24oJ2Vycm9yJywgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidW5hYmxlIHRvIGNvbm5lY3QgdG8gc29ja2V0LmlvXCIsIHJlYXNvbik7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5pbmZvKFwiZXN0YWJsaXNoZWQgY3huXCIpO1xuICAgIH0pO1xuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBwcm9jZXNzVGVtcGxhdGU6IGZ1bmN0aW9uKGRhdGEsIHRlbXBsYXRlSUQpIHtcbiAgICB2YXIgaWQgPSB0ZW1wbGF0ZUlEIHx8IHRoaXMudGVtcGxhdGVJRDtcbiAgICByZXR1cm4gZC5nYklEKGlkKS5pbm5lckhUTUwucmVwbGFjZSgveyguKj8pfS9nLCBmdW5jdGlvbihwcm9wLCBwMSkge1xuICAgICAgcmV0dXJuICh0eXBlb2YgZGF0YVtwMV0gPT09IFwidW5kZWZpbmVkXCIgPyBcIlwiIDogZGF0YVtwMV0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbn07Il19
