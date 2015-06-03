var sw = require('./socket');
var room = require('./room/main');
var util = require('./shared/util');

util.initialize();
sw.initialize();
room.initialize();