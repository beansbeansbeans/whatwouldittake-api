var gridCount;

var updateGrid = (chatterCount) => {
  if(!gridCount) { gridCount = 0; }
  
  gridCount = Math.ceil(2 * chatterCount);
};

module.exports = {
  updateChattersCount(data) {
    if(!gridCount 
      || data > gridCount
      || data < 0.5 * gridCount) {
      updateGrid(data);
    }

  },
  getGridCount() {
    return gridCount;
  }
};