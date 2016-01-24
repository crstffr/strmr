
var _ = require('lodash');
var Promise = require('promise');
var Movie = require('../../lib/models/movie');
var omdb = require('../../lib/services/omdb');

module.exports.handler = function (event, context) {

    var id = event.id;

    if (!id) {
        context.fail('No movie id was passed in');
        return;
    }

    var movie = new Movie(id);

    movie.getDetails().then(function(details){

        context.succeed(details);

    }).catch(function(err) {

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
