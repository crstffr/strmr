var qs = require('query-string');
var ptn = require('parse-torrent-name');
var respond = require('../respond');

module.exports = function(req, res) {

    var link = req.query.link;
    var params = qs.parse(link);
    var name = params.dn;

    if (!name) {
        res.end(respond.error('Unable to parse torrent name'));
        return;
    }

    res.end(respond.data(ptn(name)));

};
