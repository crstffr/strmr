var _ = require('lodash');

var zeropad = require('app/utils/zeropad');
var cleankey = require('app/utils/cleankey');
var queryString = require('query-string');
var parseTorrentName = require('parse-torrent-name');

/**
 *
 * @param {string} link
 */
module.exports = Magnet;

function Magnet(link) {

    var _this = this;
    var _errors = [];
    var _params = {};
    var _data = {};

    try {

        _params = queryString.parse(link);
        _data = parseTorrentName(_params.dn || '');
        _data.title = _.startCase(_data.title);

    } catch (e) {
        _errors.push(e);
    }

    Object.defineProperties(this, {
        properties: {
            enumerable: true,
            get: function () {
                return _data;
            }
        },
        url: {
            enumerable: true,
            get: function() {
                return String(link);
            }
        },
        errors: {
            enumerable: false,
            get: function () {
                return _errors.join('; ');
            }
        },
        isValid: {
            enumerable: false,
            get: function () {
                return Boolean(_data.title);
            }
        },
        isTV: {
            enumerable: false,
            get: function () {
                return Boolean(_this.isValid && _data.season && _data.episode);
            }
        },
        isMovie: {
            enumerable: false,
            get: function () {
                return Boolean(_this.isValid && !_this.isTV);
            }
        },
        filename: {
            enumerable: true,
            get: function () {
                return String((_this.isTV) ? _tvshowFilename() : _movieFilename());
            }
        },
        filepath: {
            enumerable: false,
            get: function () {
                return String((_this.isTV) ? _tvshowFolder() : _movieFolder());
            }
        },
        firekey: {
            enumerable: false,
            get: function() {
                return cleankey(_this.filepath + _this.filename);
            }
        }
    });

    function _tvshowFilename() {
        var s, e, r, file;
        s = zeropad(_data.season, 2);
        e = zeropad(_data.episode, 2);
        return _data.title + ' S' + s + 'E' + e;
    }

    function _movieFilename() {
        return _data.title;
    }

    function _tvshowFolder() {
        return 'tvshows/' + _data.title + '/Season ' + zeropad(_data.season, 2) + '/';
    }

    function _movieFolder() {
        return 'movies/' + _data.title + ' (' + _data.year + ')/';
    }


};