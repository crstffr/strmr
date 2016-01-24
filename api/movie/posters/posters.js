var _ = require('lodash');

var googleImages = require('google-images');

var Movie = require('strmr-common/models/movie');

var keys = {
    cse: '003929775359888328189:gq-c3wikrqc',
    api: 'AIzaSyAZHE3kL-xnaMf74VugXqge35OcobNYEA4'
};


// Lambda Handler
module.exports.handler = function (event, context) {

    var searchEngine = googleImages(keys.cse, keys.api);
    var movie = new Movie(event.id);
    var query = movie.string;

    movie.getPosters().then(function(posters){

        context.succeed(posters);

    }).catch(function(){

        searchEngine.search(query, {size: 'large'}).then(function (posters) {

            posters = _filterRatio(posters);
            posters = _stripThumbs(posters);
            posters = _orderBySize(posters);
            posters = _orderByPref(posters);

            movie.posters = posters;
            context.succeed(posters);

        }).catch(function(err){

            context.fail(err);

        });

    });

};

/**
 * Remove images that aren't in poster (portrait) ratio.
 *
 * @param images
 * @returns {Array}
 * @private
 */
function _filterRatio(images) {
    return _.filter(images, function(image) {
        var r = image.width / image.height;
        // only return images that are portrait ratio
        // which is a nice perfect 4/6 (.66666) ratio
        return r > 0.5 && r < 0.75;
    });
}

/**
 * Remove extraneous thumbnail data from the images.
 *
 * @param images
 * @returns {*}
 * @private
 */
function _stripThumbs(images) {
    return _.transform(images, function(result, i){
        delete i.thumbnail;
        result.push(i);
        return true;
    });
}

/**
 * Sort the list by largest results first.
 *
 * @param images
 * @returns {Array}
 * @private
 */
function _orderBySize(images) {
    return _.orderBy(images, 'width', 'desc');
}

/**
 * Sort the list by whether it's from a trusted source.
 *
 * @param images
 * @returns {Array}
 * @private
 */
function _orderByPref(images) {
    return _.orderBy(images, function(image) {

        var value = 0;

        var points = {
            'rogerebert.com': 3,    // good posters
            'loftcinema.com': 2,    // okay posters
            'imdb.com': 2,          // okay posters
            'trailers.net': 1       // meh
        };

        _.forEach(points, function(val, site) {
            if (image.url.indexOf(site) > -1) {
                value = val;
                return val;
            }
        });

        return value;

    }, 'desc');
}
