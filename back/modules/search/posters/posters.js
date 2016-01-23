var _ = require('lodash');
var googleImages = require('google-images');
var settings = require('../lib/settings');

// Lambda Handler
module.exports.handler = function (event, context) {

    var query = event.q || 'moon';
    var client = googleImages(settings.posters.cse, settings.posters.api);

    client.search(event.q, {size: 'large'}).then(function (images) {

        images = _filterRatio(images);
        images = _stripThumbs(images);
        images = _orderBySize(images);
        images = _orderByPref(images);

        context.succeed(images);

    }).catch(context.fail);

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
