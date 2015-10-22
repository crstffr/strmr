
var angular = require('angular');
var focus = require('./focus');

var strmr = angular.module('strmr', ['focus']);

strmr.controller('AppController', AppController);

module.exports = strmr;

AppController.$inject = ['$http', 'focusService'];

function AppController($http, focusService) {

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

    this.strm = '';
    this.reset = _reset;

    _reset();

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

    this.id = function() {

        _clearMsgs();
        var link = _this.link;
        if (!link) { _reset(); return; }

        $http.get('/id', {params: {link: link}})
            .then(function(res){
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
    };

    this.makeFiles = function() {

        _clearMsgs();
        _busy();

        $http.post('files', {link: _this.link})
            .then(function(res){
                if (res.data.error) {
                    _this.msgs.error = res.data.error.msg;
                    return;
                }
                if (res.data.ok && res.data.ok.msg) {
                    _reset();
                    _this.msgs.success = res.data.ok.msg;
                }
            }).catch(function(err){
                _this.msgs.error = err;
            }).finally(function(){
                _done();
            });
    };
}
/*

return;

$(function () {


    // Look into:
    //
    // https://www.npmjs.com/package/parse-torrent-name
    // Parses the torrent name into a nice object structure

    // https://www.npmjs.com/package/node-tracker
    // https://github.com/jduncanator/bittorrent-tracker
    // Connect to trackers to get peer info - seeders/leechers

    // https://www.npmjs.com/package/kodi-ws
    // Kodi JSON RPC library, possibly update library automatically
    // (but that would require HTPC to have ext IP address)

    // https://kat.cr/json.php?q=mouth%20of%20madness&field=seeders&order=desc
    // https://www.npmjs.com/package/kat-api
    // KickAss Torrents JSON API, can be used to locate torrents

    var $link = $("#maglink");
    var $title = $("#title");
    var $submit = $("#submit");
    var $msgbox = $("#msgbox p");

    $msgbox.hide();

    $link.on('change', function (event) {

        var $this = $(this);

        var obj = {};
        var title = '';
        var str = $this.val();

        str = decodeURIComponent(str);
        obj = $.deparam(str);

        title = obj.dn || '';


    });


    $submit.on('click', function () {

        $msgbox.hide();

        var link = $link.val();
        var title = $title.val();

        if (!link) {
            _error('Link not specified');
            return;
        }

        if (!title) {
            _error('Title not specified');
            return;
        }

        _busy();

        $.ajax({
            url: '/movie',
            type: 'POST',
            dataType: 'json',
            data: {
                link: link,
                title: title
            }
        }).done(function (res) {

            console.log(res);

            if (res.error) {
                _error(res.error.msg);
            } else if (res.ok) {
                _success(res.ok.msg);

                $link.val('');
                $title.val('');
            }

        }).fail(function (res) {

            console.error(res);

        }).always(function () {
            _ready();
        });

    });

    function _error(what) {
        $msgbox.text(what)
            .addClass('text-danger')
            .removeClass('text-success')
            .show();
    }

    function _success(what) {
        $msgbox.text(what)
            .addClass('text-success')
            .removeClass('text-danger')
            .show();
    }

    function _busy() {
        $submit.addClass('busy');
        $submit.attr('disabled', true);
    }

    function _ready() {
        $submit.removeClass('busy');
        $submit.attr('disabled', false);
    }



});

*/
