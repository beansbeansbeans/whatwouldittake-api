(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvYXNzZXRzL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9Tb2NrZXQuaW9cbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KFwiXCIsIHtcbiAgXCJjb25uZWN0IHRpbWVvdXRcIjogMTAwMCxcbiAgXCJyb29tXCI6ICd0ZXN0aW5nJ1xufSk7XG5cbnNvY2tldC5vbigndXNlciB1cGRhdGUnLCBmdW5jdGlvbihkYXRhKSB7XG4gIGNvbnNvbGUubG9nKFwiVVNFUiBVUERBVEVcIik7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xufSk7XG5cbnNvY2tldC5vbignZXJyb3InLCBmdW5jdGlvbiAocmVhc29uKXtcbiAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGNvbm5lY3QgU29ja2V0LklPJywgcmVhc29uKTtcbn0pO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKXtcbiAgY29uc29sZS5pbmZvKCdzdWNjZXNzZnVsbHkgZXN0YWJsaXNoZWQgYSB3b3JraW5nIGNvbm5lY3Rpb24nKTtcbn0pOyJdfQ==
