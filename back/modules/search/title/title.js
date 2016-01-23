var _ = require('lodash');
var Promise = require('promise');
var request = require('../lib/request');

var omdb = 'http://www.omdbapi.com/';

module.exports.handler = function (event, context) {

    var title = event.t || '';
    var year = event.y || '';

    // First do a search based on the title and year
    // and we should get back an IMDB id.  Use that
    // ID to fetch a full set of info on the title.

    _getImdbID(title, year).then(function (id) {

        _getTitleInfoByImdbID(id).then(function (info) {

            console.log(info);
            context.done(null, info);

        }).catch(context.fail);

    }).catch(context.fail);


};


function _getImdbID(title, year) {

    var url = omdb + '?s=' + title + '&y=' + year;

    return new Promise(function (resolve, reject) {

        request.get(url).then(function (result) {

            var id = _.get(result, 'Search[0].imdbID');

            if (id) {
                resolve(id);
            } else {
                reject();
            }

        });

    });
}


function _getTitleInfoByImdbID(id) {

    var url = omdb + '?i=' + id;
    return request.get(url);

}
