var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

var plugin = 'plugin://plugin.video.kmediatorrent/play/';

app.post('/movie', function (req, res) {

    var link = req.body.link;
    var title = req.body.title;

    if (!link) {
        _errOut('Link not passed to server', res);
        return;
    }

    if (!title) {
        _errOut('Title not passed to server', res);
        return;
    }

    var out = {};
    var stats = {};
    var strms = 'strms';
    var folder = strms + '/' + title;
    var basefile = folder + '/' + title;
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


    try {

        stats = fs.statSync(folder);
        _errOut(folder + ' already exists', res);

    } catch (e) {

        // if stats throws error, then the dir doesn't exist
        // so go ahead and create it along with the files.

        fs.mkdirSync(folder);

        fs.writeFileSync(linkfile, link);

        fs.writeFileSync(strmfile, plugin + encodeURIComponent(link));

        out = {ok: {msg: folder + ' created'}};

    }

    res.end(JSON.stringify(out));

});


/**
 *
 * @param msg
 * @param res
 * @private
 */
function _errOut(msg, res) {

    var out = {
        error: {
            msg: msg
        }
    };

    res.end(JSON.stringify(out));

}

app.listen(808);
