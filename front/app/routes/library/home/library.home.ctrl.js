
var ng = require('ng');
var current = require('strmr-common/current');
var userMoviesConn = require('strmr-common/connectors/api.user.movies');

module.exports = function() {

    var _this = this;

    this.link = '';

    ng.digest(function(user) {

        _this.link = userMoviesConn.url(user.id, user.email, user.password);

    });

};

