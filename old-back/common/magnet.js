
var queryString = require('query-string');
var parseTorrentName = require('parse-torrent-name');

var zeropad = require('./zeropad');
var config = require('./config');

/**
 *
 * @param {string} link
 */
module.exports = function (link) {

    var _this = this;
    var errors = [];
    var params = {};
    var data = {};

    try {
        params = queryString.parse(link);
        data = parseTorrentName(params.dn || '');
    } catch (e) {
        errors.push(e);
    }

    Object.defineProperties(this, {
        properties: {
            enumerable: true,
            get: function () {
                return data;
            }
        },
        url: {
            enumerable: true,
            get: function() {
                return String(link);
            }
        },
        errors: {
            enumerable: true,
            get: function () {
                return errors.join('; ');
            }
        },
        isValid: {
            enumerable: true,
            get: function () {
                return Boolean(data.title);
            }
        },
        isTV: {
            enumerable: true,
            get: function () {
                return Boolean(_this.isValid && data.season && data.episode);
            }
        },
        isMovie: {
            enumerable: true,
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
            enumerable: true,
            get: function () {
                return String((_this.isTV) ? _tvshowFolder() : _movieFolder());
            }
        },
        filebase: {
            enumerable: true,
            get: function() {
                return String(_this.filepath + _this.filename);
            }
        }
    });

    function _tvshowFilename() {
        var s, e, r, file;
        s = zeropad(data.season, 2);
        e = zeropad(data.episode, 2);
        r = (data.resolution) ? ' ' + data.resolution : '';
        file = data.title + ' S' + s + 'E' + e + r;
        return file.replace(/ /g, '.');
    }

    function _movieFilename() {
        return data.title.replace(/ /g, '.');
    }

    function _tvshowFolder() {
        return data.title + '/Season ' + zeropad(data.season, 2) + '/';
    }

    function _movieFolder() {
        return data.title + ' (' + data.year + ')/';
    }


};
