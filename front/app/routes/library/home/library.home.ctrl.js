
var ng = require('ng');
var userMoviesConn = require('strmr-common/connectors/api.user.movies');

module.exports = function() {

    var _this = this;

    this.link = '';

    ng.digest(function(user) {

        _this.link = userMoviesConn.url(user.id, user.email, user.password);

    });

};

