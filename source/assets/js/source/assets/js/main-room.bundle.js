(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sw = require('./socket');
var room = require('./room/main');
var util = require('./util');

util.initialize();
sw.initialize();
room.initialize();
},{"./room/main":2,"./socket":3,"./util":4}],2:[function(require,module,exports){
var util = require('../util');
var sw = require('../socket');

var getMsgHTML = function(msg) {
  return util.processTemplate({ contents: msg}, 'message_partial');
};

module.exports.initialize = function() {
  var msgList = d.qs('.messages-list');

  sw.socket.on('user update', function(data) {
    d.qs('.room-count').innerHTML = data.count;
  });

  sw.socket.on('new msg', function(msg) {
    msgList.innerHTML += getMsgHTML(msg);
  });

  sw.socket.on('seed messages', function(msgs) {
    if(msgs.length) {
      var html = "";
      msgs.forEach(function(item) {
        html += getMsgHTML(item.message);
      });
      msgList.innerHTML += html;
    }
  });

  d.gbID("send-message-button").addEventListener("click", function(e) {
    var msg = d.gbID("create-message-text").value;

    sw.socket.emit('my msg', msg);

    d.gbID("create-message-text").value = "";
  });
};
},{"../socket":3,"../util":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return d.gbID(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  },
  initialize: function() {
    window.d = document;
    d.qs = document.querySelector;
    d.qsa = document.querySelectorAll;
    d.gbID = document.getElementById;
  }
};
},{}]},{},[1]);
