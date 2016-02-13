
var ng = require('ng');
var current = require('strmr-common/current');

module.exports = function() {

    var _this = this;
    var movieid = ng.$stateParams.id;
    this.ready = false;

    ng.ready().then(function(user) {
        user.getMovie(movieid).then(function(movie){
            current.title = movie.string;
            _this.movie = movie;
            _this.ready = true;
            ng.digest();
        });
    });

};

