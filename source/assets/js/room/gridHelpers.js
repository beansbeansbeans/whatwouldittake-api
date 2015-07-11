var gridCount = 0;
var minGridCount = 20;
var coordinates = [];
var indices = [];
var mediator = require('../shared/mediator');
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var updateGridCount = (chatterCount) => {
  var oldGridCount = gridCount;

  gridCount = Math.max(minGridCount, Math.ceil(2 * chatterCount));

  if(oldGridCount !== gridCount) { updateCoordinatesAndIndices(); }
};

var updateCoordinatesAndIndices = () => {
  var squareSize = helpers.getSquareSize(),
    gridEdges = {
      top: windowHeight / 2 - squareSize / 2,
      left: windowWidth / 2 - squareSize / 2,
      right: windowWidth / 2 + squareSize / 2,
      bottom: windowHeight / 2 + squareSize / 2
    };

  coordinates = [{
    left: windowWidth / 2 - squareSize / 2,
    top: windowHeight / 2 - squareSize / 2
  }];
  
  var makeRound = () => {    
    var newGridEdges = {};

    if((gridEdges.right + squareSize) < windowWidth) {
      var topStart = gridEdges.top;

      while(topStart < gridEdges.bottom) {
        [
          {
            top: topStart,
            left: gridEdges.right
          },
          {
            top: topStart,
            left: gridEdges.left - squareSize
          }
        ].forEach(x => coordinates.push(x));

        topStart += squareSize;
      }

      newGridEdges.right = gridEdges.right + squareSize;
      newGridEdges.left = gridEdges.left - squareSize;
    }

    if((gridEdges.bottom + squareSize) < windowHeight) {
      var leftStart = gridEdges.left,
        rightEnd = gridEdges.right - squareSize;

      if(newGridEdges.right) { // there was horizontal change
        leftStart = gridEdges.left - squareSize;
        rightEnd = gridEdges.right;
      }

      while(leftStart <= rightEnd) {
        [
          {
            left: leftStart,
            top: gridEdges.top - squareSize
          },
          {
            left: leftStart,
            top: gridEdges.bottom
          }
        ].forEach(x => coordinates.push(x));

        leftStart += squareSize;
      }

      newGridEdges.bottom = gridEdges.bottom + squareSize;
      newGridEdges.top = gridEdges.top - squareSize;
    }

    newGridEdges = _.defaults(newGridEdges, gridEdges);

    if(!_.isEqual(newGridEdges, gridEdges)) {
      gridEdges = newGridEdges;
      makeRound();
    }
  };

  makeRound();

  indices = [];
  for(var i=0; i<coordinates.length; i++) { indices.push(i); }
  var random = indices.map(Math.random);
  indices = indices.sort((a, b) => random[indices.indexOf(a)] - random[indices.indexOf(b)]);
};

var helpers = {
  initialize() {},
  updateChattersCount(data) {
    if(!gridCount 
      || data > 0.75 * gridCount
      || data < 0.5 * gridCount) {
      updateGridCount(data);
    }
  },
  updateFrame: () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    updateCoordinatesAndIndices();
  },
  getIndices: () => indices,
  getCoordinates: () => coordinates,
  getGridCount: () => gridCount,
  getSquareSize: () => Math.floor(Math.sqrt(helpers.getSquareArea())),
  getSquareArea: () => Math.round(windowWidth * windowHeight / gridCount)
};

module.exports = helpers;
