var git = require('git-rev');

var  gitRevObj = {
    repKey: '{{GIT_REVISION}}',
    revState: '',
    map: []
  };

git.long(function(revision_state) {
  revision_state = revision_state.slice(0, 10);
  gitRevObj.revState = revision_state;
  gitRevObj.map = [
    [gitRevObj.repKey, gitRevObj.revState]
  ];
});

module.exports = {
  options: gitRevObj,
  getMap: function() {
    return gitRevObj.map;
  }
};

