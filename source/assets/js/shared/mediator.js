var channels = {};

module.exports = {
  subscribe (channel, callback) {
    if(!channels[channel]) { 
      channels[channel] = []; 
    }

    channels[channel].push({
      context: this,
      callback: callback
    });
  },
  unsubscribe (channel, callback) {
    if(!channels[channel]) { return false; }

    for(var i=0, l=channels[channel].length; i<l; i++) {
      if(channels[channel][i].callback === callback) {
        channels[channel].splice(i, 1);
        return true;
      }
    }
  },
  publish (channel) {
    if(!channels[channel]) {
      channels[channel] = [];
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    for(var i=0, l=channels[channel].length; i < l; i++) {
      var subscription = channels[channel][i];
      if(subscription === undefined) {
        return false;
      }
      subscription.callback.apply(subscription.context, args);
    }
  }
};