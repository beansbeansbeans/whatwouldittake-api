var h = require('virtual-dom/h');

module.exports = {
  initialize() {

  },
  render(room, onlineChatters) {
    var creator;

    if(room.creator) {
      creator = h('div.creator', [
        h('div.avatar', { 
          style: {
            backgroundImage: 'url(' + room.creator.avatarURL + ')'
          }
        }),
        h('span', 'created by '),
        h('div.creator-name', room.creator.name)
      ]);
    } else {
      creator = h('div.creator', 'Created anonymously ');
    }

    return h('div#room-info', [
      h('div.name', room.name),
      h('div.attribution', [
        creator,
        h('div.createdAt', 'on ' + moment(room.createdAt).format('MM/D')),
        h('div.onlineCount', onlineChatters.length + ' chatting now')
      ])
    ]);
  }
};