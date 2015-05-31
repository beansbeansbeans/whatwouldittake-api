var sw = require('./socket');
var index = require('./lobby/main');
var util = require('./util');

util.initialize();
sw.initialize();
index.initialize();
