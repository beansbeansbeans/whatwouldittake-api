var sw = require('./socket');
var room = require('./room/main');
var util = require('./util');

util.initialize();
sw.initialize();
room.initialize();