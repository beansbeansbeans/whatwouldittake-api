module.exports = Config;

function Config(app) {
  config = require('./config.json');

  app.set('config', config);

  app.set('mongoURL', config.mongoURL);
}