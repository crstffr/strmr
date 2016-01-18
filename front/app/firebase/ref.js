
var Firebase = require('firebase');
var settings = require('app/settings');

module.exports = new Firebase(settings.firebaseURL);
