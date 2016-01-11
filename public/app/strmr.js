var angular = require('angular');
var focus = require('./focus');
var auth = require('./auth');


var strmr = angular.module('strmr', ['focus']);

module.exports = strmr;

strmr.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

strmr.controller('AppController', AppController);

AppController.$inject = ['$http', '$rootScope', '$location', 'focusService'];

function AppController($http, $rootScope, $location, focusService) {

    var _this = this;

    var _states = {
        busy: false,
        part1: true,
        part2: false
    };

    var _msgs = {
        success: '',
        error: ''
    };

    this.id = _id;
    this.strm = '';
    this.auth = auth;
    this.reset = _reset;
    this.makeFiles = _makeFiles;

    auth.onChange(function(){
        $rootScope.$applyAsync();
    });

    _reset();
    _prefill();

    function _prefill() {
        if ($location.search().uri) {
            _this.link = $location.search().uri;
            $location.url($location.path());
            _this.id();
        }
    }

    function _reset() {
        _this.state = angular.copy(_states);
        _this.msgs = angular.copy(_msgs);
        _this.torrent = {};
        _this.link = '';
        focusService.setFocus('link');
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
        if (!link) {
            _reset();
            return;
        }

        $http.get('/id', {params: {link: link}})
            .then(function (res) {
                if (res.data.error) {
                    _this.msgs.error = res.data.error.msg;
                    return;
                }
                if (res.data.ok && res.data.ok.data) {
                    _this.torrent = res.data.ok.data;
                    _this.strm = _this.torrent.filepath;
                    _part2();

                    if (!_this.torrent.filepath) {
                        _this.msgs.error = 'Response does not include a filepath';
                    }
                }
            });
    }

    function _makeFiles() {

        _clearMsgs();
        _busy();

        $http.post('files', {link: _this.link})
            .then(function (res) {
                if (res.data.error) {
                    _this.msgs.error = res.data.error.msg;
                    return;
                }
                if (res.data.ok && res.data.ok.msg) {
                    _reset();
                    _this.msgs.success = res.data.ok.msg;
                }
            }).catch(function (err) {
                _this.msgs.error = err;
            }).finally(function () {
                _done();
            });
    }
}
