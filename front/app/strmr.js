var angular = require('angular');
var Magnet = require('app/common/magnet');
var focus = require('app/common/forms/focus');
var current = require('app/common/current');
var auth = require('app/common/auth');
var Strm = require('app/data/strm');

window._ = require('lodash');

module.exports = angular
    .module('strmr', ['focus'])
    .controller('AppController', AppController)
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);

AppController.$inject = ['$http', '$rootScope', '$location', 'focusService'];

function AppController($http, $rootScope, $location, focusService) {

    var _this = this;

    var _states = {
        busy: false,
        part1: true,
        part2: false,
        login: false
    };

    var _msgs = {
        success: '',
        error: ''
    };

    this.id = _id;
    this.auth = auth;
    this.save = _save;
    this.login = _login;
    this.reset = _reset;

    _reset();
    _prefill();

    auth.onChange(function(user){
        $rootScope.$applyAsync();
        if (user) {
            window.user = user;
            console.log('window.user', user);
            focusService.setFocus('link');
            _this.state.login = false;
        }
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
        _this.torrent = {};
        _this.link = '';

        if (auth.loggedIn) {
            focusService.setFocus('link');
        } else {
            focusService.setFocus('login');
        }
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

    function _login() {
        _this.state.login = true;
        _this.auth.login().then(function(){
            _this.state.login = false;
        });
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
            _part2();
        }

    }

    function _save() {

        _clearMsgs();
        var strm = new Strm(_this.magnet);

        _reset();
        _this.msgs.success = 'Strm created successfully'

    }
}
