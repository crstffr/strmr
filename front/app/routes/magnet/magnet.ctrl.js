var _ = require('lodash');
var angular = require('angular');
var current = require('strmr-common/current');
var Strm = require('strmr-common/models/strm');
var Magnet = require('strmr-common/models/magnet');

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

    _reset();
    _prefill();

    function _prefill() {
        var link = $location.search().uri || current.magnet;
        if (!_.isEmpty(link)) {
            _this.link = link;
            _this.id();
        }
    }

    function _reset() {
        focusService.setFocus('link');
        _this.state = angular.copy(_states);
        _this.msgs = angular.copy(_msgs);
        _this.link = '';
    }

    function _clearMsgs() {
        _this.msgs.success = '';
        _this.msgs.error = '';
    }

    function _part2() {
        _this.state.part1 = false;
        _this.state.part2 = true;
        focusService.setFocus('save');
    }

    function _id() {

        _clearMsgs();
        var link = _this.link;
        if (!link) { _reset(); return; }

        _this.magnet = new Magnet(link);

        if (!_this.magnet.isValid) {
            _this.msgs.error = 'Link is not a valid magnet';
        } else if (_this.magnet.isTV) {
            _this.msgs.error = 'Strmr does not support TV shows (yet)';
        } else {
            _part2();
        }

    }

    function _save() {

        _clearMsgs();
        new Strm(_this.magnet, current.user);
        _this.msgs.success = 'Done!';

    }

}
