module.exports = {
  processTemplate: function(data, templateID) {
    var id = templateID || this.templateID;
    return d.gbID(id).innerHTML.replace(/{(.*?)}/g, function(prop, p1) {
      return (typeof data[p1] === "undefined" ? "" : data[p1]);
    }.bind(this));
  }
};