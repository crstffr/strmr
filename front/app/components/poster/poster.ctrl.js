
var _ = require('lodash');
var ng = require('ng');

module.exports = PosterController;

function PosterController() {

    var _this = this;

    this.loading = false;

    _this.movie.getPoster().then(function(poster){
        _.assign(_this, poster);
        ng.digest();
    });

}
