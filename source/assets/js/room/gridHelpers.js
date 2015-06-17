var chattersCount = 0;
var gridCount = 0;

module.exports = {
  updateChattersCount(data) {
    chattersCount = data;
  },
  getGridCount() {
    return chattersCount;
  }
};