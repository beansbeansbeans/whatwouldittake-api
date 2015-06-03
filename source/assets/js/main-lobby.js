var sw = require('./socket');
var index = require('./lobby/main');
var util = require('./shared/util');
var auth = require('./shared/auth');

util.initialize();
auth.initialize();
sw.initialize();
index.initialize();
