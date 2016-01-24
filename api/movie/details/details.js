
var _ = require('lodash');

var Movie = require('strmr-common/models/movie');
var omdb = require('strmr-common/connectors/omdb');

module.exports.handler = function (event, context) {

    var id = event.id;

    if (!id) {
        context.fail('No movie id was passed in');
        return;
    }

    var movie = new Movie(id);

    movie.getDetails().then(function(details) {

        console.log('we have it');

        context.succeed(details);

    }).catch(function(err) {

        console.log('get from OMDB');

        omdb.getMovieDetails(movie.title, movie.year).then(function(details) {

            // Fix the capitalized key names and any funky foreign characters

            details = _.transform(details, function(result, val, key) {
                result[_.lowerFirst(key)] = _.deburr(val);
                return true;
            });

            // Now that we have the definitive details for the movie,
            // make sure that the title and year are set correctly.
            // This will fix any spelling errors or wrong dates.

            movie.year = details.year;
            movie.title = details.title;

            // This will save it into firebase

            movie.details = details;

            context.succeed(details);

        }).catch(function(err) {

            console.log('Error:', err);
            context.fail(err);

        });

    });


};
