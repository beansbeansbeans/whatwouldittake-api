var util = require('../shared/util');
var Immutable = require('immutable');

var messageDB = Immutable.List();

var db2 = messageDB.push("hi");

console.log("IN MESSAGES");
console.log(db2.get(0));