var h = require('virtual-dom/h');

module.exports = {
  initialize() {

  },
  render(dimensions, messages, chatters) {
    return h('ul.messages', {
      style: {
        height: (dimensions.containerHeight - (dimensions.roomInfoHeight + dimensions.createMessageHeight)) + "px"
      }
    } , messages.sort((a, b) => {
      if(a.createdAt < b.createdAt) {
        return -1;
      } else if(a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    }).map((msg) => {
      var avatarURL, author = chatters.filter(x => x._id === msg.user._id)[0];

      if(author) { avatarURL = author.avatarURL; }

      return h('li.message', 
        [h('div.avatar', {
          style: {
            backgroundImage: 'url(' + avatarURL + ')'
          }
        }),
        h('div.contents', [
          h('div.attribution', [
            h('div.creator', msg.user.name),
            h('div.createdAt', moment(msg.createdAt).format('MMM/DD'))
          ]),
          h('div.text', msg.message.msg)
        ])
      ]);
    }));
  }
};