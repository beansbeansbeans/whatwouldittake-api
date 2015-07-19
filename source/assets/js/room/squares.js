var h = require('virtual-dom/h');
var gridHelpers = require('./gridHelpers');

module.exports = function(onlineChatters) {
  var squareSize = gridHelpers.getSquareSize(),
    coordinates = gridHelpers.getCoordinates(),
    minTop = Math.min.apply(Math, _.pluck(coordinates, 'top')) - squareSize / 2,
    minLeft = Math.min.apply(Math, _.pluck(coordinates, 'left')) - squareSize / 2;

  return h('div.squares-container', {
    style: {
      backgroundSize: squareSize + "px " + squareSize + "px",
      backgroundPosition: minLeft + 'px ' + minTop + "px"
    }
  },
  coordinates.map((square, index) => {
    var associatedChatter = _.findWhere(onlineChatters, {coordinateID: index});
    var attributes = {
      style: {
        width: squareSize + "px",
        height: squareSize + "px",
        top: square.top + "px",
        left: square.left + "px"
      },
      dataset: { occupied: false },
      key: index
    },
    contents;

    if(associatedChatter) {
      attributes.dataset.occupied = true;
      attributes.dataset.associatedChatterId = associatedChatter._id;
      contents = associatedChatter._id;
      contents = h('div.attribution', [
        h('div.username', associatedChatter.name),
        h('div.avatar', {
          style: {
            backgroundImage: 'url(' + associatedChatter.avatarURL + ')'
          }
        })
      ]);
    }

    return h('div.square', attributes, contents)
  }));
}