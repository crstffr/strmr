var _ = require('lodash');
var Promise = require('promise');
var request = require('../request');
var omdbURL = require('../settings').omdbURL;

module.exports = {

    getMovieDetails: _getMovieDetails

};

/**
 *
 * @param {String} title
 * @param {String} year
 * @returns {Promise}
 * @private
 */
function _getMovieDetails(title, year) {

    title = title || '';
    year = year || '';

    console.log(title, year);

    return new Promise(function (resolve, reject) {

        _getImdbID(title, year).then(function (id) {

            _getMovieDetailsByImdbID(id).then(function (details) {

                resolve(details);

            }).catch(reject);

        }).catch(reject);

    });

}


function _getImdbID(title, year) {

    var url = omdbURL + '?s=' + title + '&y=' + year;

    return new Promise(function (resolve, reject) {

        request.get(url).then(function (result) {

            var id = _.get(result, 'Search[0].imdbID');

            if (id) {
                resolve(id);
            } else {
                reject('imdb id lookup came up empty');
            }

        }).catch(reject);

    });
}


function _getMovieDetailsByImdbID(imdbID) {

    var url = omdbURL + '?i=' + imdbID;
    return request.get(url);

}
