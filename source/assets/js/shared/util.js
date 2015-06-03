module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return d.gbID(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  },
  initialize: function() {
    window.d = document;
    d.qs = document.querySelector;
    d.qsa = document.querySelectorAll;
    d.gbID = document.getElementById;
  }
};