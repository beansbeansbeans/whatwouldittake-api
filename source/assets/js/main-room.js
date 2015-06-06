var sw = require('./socket');
var room = require('./room/main');
var util = require('./shared/util');
var auth = require('./shared/auth');

util.initialize();
auth.initialize();
sw.initialize();
room.initialize();