
var _ = require('lodash');
var current = require('./current');

module.exports = HTML;

function HTML(path, strms) {

    var out = '<html>' +
              '<head><title>Index of ' + path + '</title></head>' +
              '<body bgcolor="white">' +
              '<h1>Index of ' + path + '</h1><hr><pre>';

    strms.forEach(function(strm){

        var file = strm.key() + '.strm';
        var link = '/development/strms' + path + file;
        var auth = current.user.authString;
        out += '<a href="' + link + auth + '">' + file + '</a>\n';

    });

    out += '</pre><hr></body></html>';

    return out;

}
