var _ = require('lodash');
var auth = require('strmr-common/auth');
var htmlout = require('strmr-common/utils/htmlout');
var settings = require('strmr-common/settings');

module.exports.handler = function (event, context) {

    var uid = event.uid;
    var email = event.u;
    var password = event.p;
    var movieid = event.movie;

    if (!uid) {
        context.succeed(htmlout({header: 'No user id specified'}));
        return;
    }

    if (!email) {
        context.succeed(htmlout({header: 'No email specified'}));
        return;
    }

    if (!password) {
        context.succeed(htmlout({header: 'No password specified'}));
        return;
    }

    if (!movieid) {
        context.succeed(htmlout({header: 'No movie specified'}));
        return;
    }

    auth.withPassword(uid, email, password).then(function (user) {

        user.getMovie(movieid).then(function(movie){

            var plugin = settings.kodi.plugin;
            var output = plugin + encodeURIComponent(movie.magnet);

            context.succeed(output);

        }).catch(function(err){

            context.succeed(htmlout({header: err}));

        });

    }).catch(function (err) {

        context.succeed(htmlout({header: err}));

    });



};
