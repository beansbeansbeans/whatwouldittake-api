var grid;
var gridCount;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var updateGrid = (chatterCount) => {
  if(!gridCount) { gridCount = 0; }

  var oldGridCount = gridCount;
  gridCount = Math.max(10, Math.ceil(2 * chatterCount));

  if(oldGridCount !== gridCount) {
    render();
  }
};

var render = () => {
  if(!grid) { return; }

  var size = helpers.getSquareSize();
  var {across, down} = helpers.getGridOrientation();
  var data = new Array(across * down);
  var squares = grid.selectAll("rect").data(data);

  squares.enter().append("rect");

  squares.attr("width", Math.sqrt(size)).attr("height", Math.sqrt(size))
    .attr("x", function(d, i) {
      return i * 100;
    })
    .attr("y", function(d, i) {
      return i * 100;
    });

  // so the next step here is to arrange the squares in some regimented fashion
  // start at the center
  // them arrange them in pinwheels starting at right-hand position until you fill the screen
  // no that doesn't work because the screen's not always a square
  // 
  // could go the spontaneous route... could actually look kind of cool
  // no...

  squares.exit().remove();
};

var helpers = {
  initialize() {
    var container = d3.select(".svg-container");
    grid = container.append("svg")
      .attr("width", windowWidth).attr("height", windowHeight);

    render();
  },
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
      down++; // extra buffer... why not
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

module.exports = helpers;
