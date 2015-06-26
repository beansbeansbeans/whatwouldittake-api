var grid;
var gridCount = 0;
var coordinates = [];
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var updateGridCount = (chatterCount) => {
  var oldGridCount = gridCount;

  gridCount = Math.max(10, Math.ceil(2 * chatterCount));

  if(oldGridCount !== gridCount) {
    render();
  }
};

var render = () => {
  if(!grid) { return; }

  var squareSize = Math.floor(Math.sqrt(helpers.getSquareArea())),
    gridEdges = {
      right: windowWidth / 2 + squareSize / 2,
      bottom: windowHeight / 2 + squareSize / 2
    };

  coordinates = [{
    left: windowWidth / 2 - squareSize / 2,
    top: windowHeight / 2 - squareSize / 2
  }];
  
  var makeRound = () => {
    var newGridEdges = {};

    if(gridEdges.right < windowWidth) {
      [
        {
          left: gridEdges.right,
          top: gridEdges.bottom - squareSize
        }, 
        {
          left: gridEdges.right - 2 * squareSize,
          top: gridEdges.bottom - squareSize
        }
      ].forEach(x => coordinates.push(x));

      newGridEdges.right = gridEdges.right + squareSize;
    }

    if(gridEdges.bottom < windowHeight) {
      [
        {
          left: gridEdges.right,
          top: gridEdges.bottom
        },
        {
          left: gridEdges.right - squareSize,
          top: gridEdges.bottom
        },
        {
          left: gridEdges.right - 2 * squareSize,
          top: gridEdges.bottom
        },
        {
          left: gridEdges.right,
          top: gridEdges.bottom - 2 * squareSize
        },
        {
          left: gridEdges.right - squareSize,
          top: gridEdges.bottom - 2 * squareSize
        },
        {
          left: gridEdges.right - 2 * squareSize,
          top: gridEdges.bottom - 2 * squareSize
        }
      ].forEach(x => coordinates.push(x));

      newGridEdges.bottom = gridEdges.bottom + squareSize;
    }

    newGridEdges = _.defaults(newGridEdges, gridEdges);

    if(!_.isEqual(newGridEdges, gridEdges)) {
      gridEdges = newGridEdges;
      makeRound();
    }
  };

  makeRound();

  coordinates.forEach((x) => {
    var square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("style", "width:" + squareSize + "px;height:" + squareSize + "px;top:" + x.top + "px;left:" + x.left + "px");
    grid.appendChild(square);
  });
};

var helpers = {
  initialize() {
    grid = d.qs(".squares-container");
    render();
  },
  updateChattersCount(data) {
    if(!gridCount 
      || data > 0.75 * gridCount
      || data < 0.5 * gridCount) {
      updateGridCount(data);
    }
  },
  getGridCount: () => gridCount,
  getSquareArea: () => Math.round(windowWidth * windowHeight / gridCount)
};

module.exports = helpers;
