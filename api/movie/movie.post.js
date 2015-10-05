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
    var data = ptn(name);

    if (!data.title) {
        res.end(respond.error('Cannot parse torrent title'));
        return;
    }

    var title = data.title + ' (' + data.year + ')';

    var out = {};
    var stats = {};

    var strms = paths.root;
    var folder = paths.movies + title + '/';
    var basefile = folder + title;
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

    mkdirp(folder, function(err){
        if (err) {
            res.end(respond.error(err));
            return;
        }

        fs.writeFileSync(linkfile, link);
        fs.writeFileSync(strmfile, plugin + encodeURIComponent(link));
        res.end(respond.ok(strmfile + ' created'));
    });
};
