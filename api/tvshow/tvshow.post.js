var fs = require('fs');
var qs = require('query-string');
var ptn = require('parse-torrent-name');
var mkdirp = require('mkdirp');
var config = require('../../config');
var respond = require('../respond');

var plugin = config.kodi.plugin;

module.exports = function (req, res) {

    var link = req.body.link;
    var paths = config.paths.strms;

    if (!link) {
        res.end(respond.error('Link not passed to server'));
        return;
    }

    var params = qs.parse(link);
    var name = params.dn;
    var t = ptn(name);

    if (!t.title) {
        res.end(respond.error('Cannot parse torrent title'));
        return;
    }

    var s = _zeroPad(t.season, 2);
    var e = _zeroPad(t.episode, 2);

    var file = t.title + ' S' + s + 'E' + e + ((t.resolution) ? ' ' + t.resolution : '');
    file = file.replace(/ /g, '.');

    var out = {};
    var stats = {};

    var strms = paths.root;
    var folder = paths.tvshows;
    var title = folder + t.title + '/';
    var season = title + 'Season ' + _zeroPad(t.season, 2) + '/';
    var basefile = season + file;
    var strmfile = basefile + '.strm';
    var linkfile = basefile + '.link';

    try {
        fs.statSync(strms);
    } catch (e) {
        try {
            fs.lstatSync(strms);
        } catch (e) {
            fs.mkdirSync(strms);
        }
    }

    mkdirp(season, function(err){
        if (err) {
            res.end(respond.error(err));
            return;
        }

        fs.writeFileSync(linkfile, link);
        fs.writeFileSync(strmfile, plugin + encodeURIComponent(link));
        res.end(respond.ok(strmfile + ' created'));

    });

};

function _zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
