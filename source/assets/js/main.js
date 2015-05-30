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