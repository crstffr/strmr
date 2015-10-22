var qs = require('query-string');
var ptn = require('parse-torrent-name');
var respond = require('../../common/respond');
var Filemaker = require('../../common/filemaker');

module.exports = function(req, res) {

    var torrent = new Filemaker(req.query.link);

    if (!torrent.isValid) {
        res.end(respond.error('Unable to parse magnet link', torrent.errors));
        return;
    }

    res.end(respond.data({
        filepath: torrent.filebase
    }));

};
