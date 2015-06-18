var gridCount;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var updateGrid = (chatterCount) => {
  if(!gridCount) { gridCount = 0; }
  
  gridCount = Math.max(10, Math.ceil(2 * chatterCount));
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
  },
  getSquareSize() {
    return Math.round(windowWidth * windowHeight / gridCount);
  },
  getDownFromAcross (across) {
    return Math.ceil(windowWidth * windowHeight / across / this.getSquareSize());
  },
  getGridOrientation() {
    var area = windowWidth * windowHeight,
      widthOverHeight = windowWidth / windowHeight,
      across = Math.ceil(Math.sqrt(area) / this.getSquareSize()),
      down = this.getDownFromAcross(across);
    
    if(across / down < widthOverHeight) {
      while( across / down < widthOverHeight) {
        across++;
        down = this.getDownFromAcross(across);
      }
      down++;
    } else {
      while( across / down > widthOverHeight) {
        across--;
        down = this.getDownFromAcross(across);
      }
      across++;
    }

    return {
      across: across,
      down: down
    };
  }
};
