
var ng = require('ng');
var current = require('strmr-common/current');
var Magnet = require('strmr-common/models/magnet');
var moviesConn = require('strmr-common/connectors/api.user.movies');

module.exports = MagnetController;

MagnetController.$inject = ['$http', '$rootScope', '$location', 'focusService'];

function MagnetController($http, $rootScope, $location, focusService) {

    var _this = this;

    var _states = {
        busy: false,
        part1: true,
        part2: false,
        login: false,
        poster: false,  // busy state when fetching poster
        info: false     // busy state when fetching imdb info
    };

    var _msgs = {
        success: '',
        error: ''
    };

    this.id = _id;
    this.info = {};
    this.magnet = {};
    this.poster = {};

    this.save = _save;
    this.reset = _reset;

    this.links = {
        movies: '',
        tvshows: ''
    };

    _reset();
    _prefill();

    ng.ready().then(function(user) {
        console.log('user', user);
    });

    function _prefill() {
        if ($location.search().uri) {
            _this.link = $location.search().uri;
            _this.id();
        }
    }

    function _reset() {

        _this.state = angular.copy(_states);
        _this.msgs = angular.copy(_msgs);
        _this.link = '';

        focusService.setFocus('link');
    }



    function _buildLinks() {

        console.log(current.user);

        //var url = moviesConn(auth.user.is, )

        var base = '';

        var cred = '?';
        cred +=  'u=' + current.user.email;
        cred += '&p=' + current.user.token;

        _this.links.movies = base + 'movies/' + cred;
        _this.links.tvshows = base + 'tvshows/' + cred;

    }


    function _clearMsgs() {
        _this.msgs.success = '';
        _this.msgs.error = '';
    }

    function _part1() {
        _this.state.part1 = true;
        _this.state.part2 = false;
    }

    function _part2() {
        _this.state.part1 = false;
        _this.state.part2 = true;
        focusService.setFocus('save');
    }

    function _busy() {
        _this.state.busy = true;
    }

    function _done() {
        _this.state.busy = false;
    }


    function _id() {

        _clearMsgs();
        var link = _this.link;
        if (!link) { _reset(); return; }

        _this.magnet = new Magnet(link);

        window.magnet = _this.magnet;
        console.log('window.magnet', _this.magnet);

        if (!_this.magnet.isValid) {
            _this.msgs.error = 'Link is not a valid magnet';
        } else {
            _search();
            _part2();
        }

    }


    function _search() {

        var title = _this.magnet.properties.title;
        var year = _this.magnet.properties.year;

        _this.state.poster = true;
        _this.state.title = true;

        search.posters(title, year).then(function(posters){
            _this.poster = posters[0];
            _this.state.poster = false;
            $rootScope.$applyAsync();
        });

        search.titles(title, year).then(function(info){
            console.log(info);
            _this.info = info;
            $rootScope.$applyAsync();
        });

    }


    function _save() {

        _clearMsgs();
        var strm = new Strm(_this.magnet);

        _reset();
        _this.msgs.success = 'Strm created successfully'

    }




}
