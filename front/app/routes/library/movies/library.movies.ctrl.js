var ng = require('ng');

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

