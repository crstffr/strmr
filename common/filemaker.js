var fs = require('fs');
var qs = require('query-string');
var ptn = require('parse-torrent-name');
var mag2tor = require('magnet-to-torrent');
var request = require('request');
var mkdirp = require('mkdirp');
var zeropad = require('./zeropad');
var config = require('../config');

/**
 *
 * @param {string} link
 */
module.exports = function (link) {

    var _this = this;
    var paths = config.paths.strms;
    var errors = [];
    var params = {};
    var data = {};
    var dn = '';

    try {
        params = qs.parse(link);
        dn = params.dn || '';
        data = ptn(dn);
    } catch (e) {
        errors.push(e);
    }

    Object.defineProperties(this, {
        errors: {
            get: function () {
                return errors.join('; ');
            }
        },
        isValid: {
            get: function () {
                return Boolean(data.title);
            }
        },
        isTV: {
            get: function () {
                return Boolean(_this.isValid && data.season && data.episode);
            }
        },
        isMovie: {
            get: function () {
                return Boolean(_this.isValid && !_this.isTV);
            }
        },
        magnet: {
            get: function() {
                return String(link);
            }
        },
        filename: {
            get: function () {
                return String((_this.isTV) ? _tvshowFilename() : _movieFilename());
            }
        },
        filepath: {
            get: function () {
                return String((_this.isTV) ? _tvshowFolder() : _movieFolder());
            }
        },
        filebase: {
            get: function() {
                return String(_this.filepath + _this.filename);
            }
        }
    });

    this.makeAll = function() {

        return new Promise(function(resolve, reject){

            _this.makeDir().then(function(){

                Promise.all([
                    _this.makeLink(),
                    _this.makeStrm(),
                    _this.makeTorrent()
                ])
                .then(resolve)
                .catch(reject);

            }).catch(function(err){
                reject(err);
            });
        });
    };

    this.makeDir = function() {
        return new Promise(function(resolve, reject){
            mkdirp(_this.filepath, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    this.makeLink = function () {
        if (!_this.isValid) {
            return Promise.reject('Cannot make link, magnet is invalid');
        }
        return new Promise(function (resolve, reject) {
            var file = _this.filebase + '.link';
            var body = _this.magnet;
            fs.writeFile(file, body, function (err) {
                (err) ? reject(err) : resolve();
            });
        });
    };

    this.makeStrm = function () {
        if (!_this.isValid) {
            return Promise.reject('Cannot make strm, magnet is invalid');
        }
        return new Promise(function (resolve, reject) {
            var plugin = config.kodi.plugin;
            var file = _this.filebase + '.strm';
            var body = plugin + encodeURIComponent(_this.magnet);
            fs.writeFile(file, body, function (err) {
                (err) ? reject(err) : resolve();
            });
        });
    };

    this.makeTorrent = function () {
        if (!_this.isValid) {
            return Promise.reject('Cannot make torrent, magnet is invalid');
        }

        return new Promise(function (resolve, reject) {
            var file = _this.filebase + '.torrent';
            mag2tor.getLink(_this.magnet).then(function (torrent) {
                request(torrent, function (error, response, body) {
                    if (error) {
                        reject('torrent request error: ' + error);
                    } else {
                        fs.writeFile(file, body, function(err){
                            (err) ? reject(err) : resolve();
                        });
                    }
                });
            }).fail(function (error) {
                reject('magnet to torrent error: ' + error);
            });
        });
    };


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
        return paths.tvshows + data.title + '/Season ' + zeropad(data.season, 2) + '/';
    }

    function _movieFolder() {
        return paths.movies + data.title + ' (' + data.year + ')/';
    }


};
