
var ng = require('ng');
var current = require('strmr-common/current');

module.exports = function() {

    var _this = this;

    _this.movies = [];

    ng.ready().then(function(user){
        user.getMovies().then(function(movies){
            _this.movies = movies;
            ng.digest();
        });
    });

};

