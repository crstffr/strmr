var _ = require('lodash');
var ng = require('ng');
var angular = require('angular');
var current = require('strmr-common/current');
var Strm = require('strmr-common/models/strm');
var Magnet = require('strmr-common/models/magnet');

module.exports = MagnetController;

MagnetController.$inject = ['$location', 'focusService'];

function MagnetController($location, focusService) {

    var _this = this;

    var _states = {
        part1: true,
        part2: false,
        addButton: false,
        identifying: false
    };

    var _msgs = {
        success: '',
        error: ''
    };

    var _alerts = {
        diffExists: false,
        exactExists: false,
        success: false
    };

    this.id = _id;
    this.msgs = {};
    this.state = {};
    this.alerts = {};
    this.magnet = {};

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
        _this.alerts = angular.copy(_alerts);
        _this.state = angular.copy(_states);
        _this.msgs = angular.copy(_msgs);
        _this.link = '';
    }

    function _clearMsgs() {
        _this.msgs.success = '';
        _this.msgs.error = '';
    }

    function _id() {

        _clearMsgs();
        var link = _this.link;
        if (!link) { _reset(); return; }

        _this.state.addButton = false;
        _this.state.identifying = true;

        _this.magnet = new Magnet(link);

        if (!_this.magnet.isValid) {

            _this.msgs.error = 'Link is not a valid magnet';
            _this.state.identifying = false;

        } else if (_this.magnet.isTV) {

            _this.msgs.error = 'Strmr does not support TV shows (yet)';
            _this.state.identifying = false;

        } else {

            _this.state.part1 = false;
            _this.state.part2 = true;

            current.title = _this.magnet.movie.string;

            focusService.setFocus('save');

            ng.ready().then(function(user) {

                user.getStrmById(_this.magnet.movie.id).then(function(strm){

                    var oldMagnet = new Magnet(strm.url);
                    var oldTorrent = _.lowerCase(oldMagnet.torrentname.toLowerCase());
                    var newTorrent = _.lowerCase(_this.magnet.torrentname.toLowerCase());

                    if (oldTorrent === newTorrent) {
                        _this.alerts.exactExists = true;
                    } else {
                        _this.alerts.diffExists = true;
                        _this.state.addButton = true;
                    }

                }).catch(function(){

                    _this.state.addButton = true;

                }).finally(function(){

                    _this.state.identifying = false;

                });

            });

        }

    }

    function _save() {

        _clearMsgs();
        new Strm(_this.magnet, current.user);

        _this.alerts.success = true;
        _this.alerts.diffExists = false;
        _this.alerts.exactExists = false;
        _this.state.addButton = false;

        _this.msgs.success = 'Done!';

    }

}
