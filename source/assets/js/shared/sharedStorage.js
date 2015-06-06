var data = {};

module.exports = {
  get: function(key) {
    if(data[key]) { return data[key]; }
  },
  put: function(key, value) {
    data[key] = value;
  },
  delete: function(key) {
    if(data[key]) { delete data[key]; }
  }
};