var knownOptions = {
  string: 'module',
  default: { module: 'web' }
};

var options = require('minimist')(process.argv.slice(2), knownOptions);

module.exports = require('./config/' + options.module + '.js');
