var _ = require('lodash');
var ng = require('ng');

module.exports = MovieController;

function MovieController() {

    var _this = this;

    var movie;
    var Movie = require('strmr-common/models/movie');
    var details = require('strmr-common/connectors/api.movie.details');
    var posters = require('strmr-common/connectors/api.movie.posters');

    this.posterIndex = 0;
    this.loadingPosters = true;
    this.loadingDetails = true;

    if (!_.isEmpty(this.magnet)) {
        console.log(this.magnet);
        movie = this.magnet.movie;
    } else {
        movie = new Movie(this.title, this.year);
    }

    this.details = movie.details;
    this.posters = movie.posters;
    this.poster = movie.poster;

    console.log(movie);

    this.prevPoster = function () {
        if (_this.posterIndex > 0) {
            _this.posterIndex--;
        }
        _this.poster = movie.poster = _this.posters[_this.posterIndex];
        ng.digest();
    };

    this.nextPoster = function () {
        if (_this.posterIndex + 1 < _this.posters.length) {
            _this.posterIndex++;
        }
        _this.poster = movie.poster = _this.posters[_this.posterIndex];
        ng.digest();
    };

    this.removePoster = function(poster) {
        _.pull(_this.posters, poster);
        movie.posters = _this.posters;
        _this.poster = movie.poster = _this.posters[_this.posterIndex];
        ng.digest();
    };

    function _getDetails() {
        return new Promise(function (resolve) {
            movie.getDetails().then(resolve).catch(function () {
                details.get(movie.id).then(resolve);
            });
        });
    }

    function _getPosters() {
        return new Promise(function (resolve) {
            movie.getPosters().then(resolve).catch(function(){
                posters.get(movie.id).then(resolve);
            });
        });
    }

    _getDetails().then(function (details) {
        _this.details = details;
        _this.loadingDetails = false;
        ng.digest();
    });

    _getPosters().then(function(posters){
        _this.poster = movie.poster || posters[0];
        _this.posters = movie.posters || posters;
        _this.posterIndex = _.findIndex(_this.posters, _this.poster);
        _this.loadingPosters = false;
        ng.digest();
    });

}
