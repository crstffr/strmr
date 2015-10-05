
var angular = require('angular');

var strmr = angular.module('strmr', []);

strmr.controller('AppController', AppController);

module.exports = strmr;

AppController.$inject = ['$http'];

function AppController($http) {

    var _this = this;

    var _states = {
        part1: true,
        part2: false,
        movie: false,
        tvshow: false
    };

    var _msgs = {
        success: '',
        error: ''
    };

    this.strm = '';
    this.reset = _reset;

    _reset();

    this.submit = function() {
        _clearMsgs();
        return false;
    };

    this.id = function() {

        _clearMsgs();

        var link = _this.link;

        if (!link) {
            _reset();
            return;
        }

        $http.get('/id', {params: {link: link}}).then(function(res){
            if (res.data.error) {
                _this.msgs.error = res.data.error.msg;
                return;
            }

            if (res.data.ok && res.data.ok.data) {
                _this.torrent = res.data.ok.data;
                _setupPart2();
            }
        });
    };

    this.makeMovie = function() {

        _clearMsgs();

        $http.post('movie', {
            link: _this.link
        }).then(function(res){
            if (res.data.error) {
                _this.msgs.error = res.data.error.msg;
                return;
            }
            if (res.data.ok && res.data.ok.msg) {
                _this.msgs.success = res.data.ok.msg;
            }
        });
    };

    this.makeTvshow = function() {

        _clearMsgs();

        $http.post('tvshow', {
            link: _this.link
        }).then(function(res){
            if (res.data.error) {
                _this.msgs.error = res.data.error.msg;
                return;
            }
            if (res.data.ok && res.data.ok.msg) {
                _this.msgs.success = res.data.ok.msg;
            }
        });
    };

    function _setupPart2() {

        if (!_this.torrent.title) {
            _this.msgs.error = 'Returned data does not include a title';
        }

        if (_this.torrent.season) {
            _showTvshow();
        } else {
            _showMovie();
        }

    }

    function _showTvshow() {
        _this.state.tvshow = true;
        _this.state.movie = false;

        var t = _this.torrent;
        var s = _zeroPad(t.season, 2);
        var e = _zeroPad(t.episode, 2);

        var path = t.title + ' S' + s + 'E' + e + ((t.resolution) ? ' ' + t.resolution : '');
        path = path.replace(/ /g, '.');

        _this.strm = [t.title, 'Season ' + t.season, path].join('/');

    }

    function _showMovie() {
        _this.state.tvshow = false;
        _this.state.movie = true;

        var t = _this.torrent;
        _this.strm = t.title + ' (' + t.year + ')';
    }

    function _formatStrm() {

    }

    function _zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }

    function _clearMsgs() {
        _this.msgs.success = '';
        _this.msgs.error = '';
    }

    function _reset() {
        _this.state = angular.copy(_states);
        _this.msgs = angular.copy(_msgs);
        _this.torrent = {};
        _this.link = '';
    }

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
