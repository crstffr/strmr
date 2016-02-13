var _ = require('lodash');

var pad = require('pad');
var auth = require('strmr-common/auth');
var htmlout = require('strmr-common/utils/htmlout');
var userMovieConn = require('strmr-common/connectors/api.user.movie');

module.exports.handler = function (event, context) {

    var uid = event.uid;
    var email = event.u;
    var password = event.p;

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

    auth.withPassword(uid, email, password).then(function (user) {

        user.getMovies().then(function(movies) {

            context.succeed(htmlout({
                title: 'Index of /movies/',
                header: 'Index of /movies/',
                body: _buildLinks(movies, user)
            }));

        });

    }).catch(function (err) {

        context.succeed(htmlout({header: err}));

    });


    function _buildLinks(movies, user) {

        var out = '';
        out += '<hr><pre><a href="../">../</a>\n';

        _.forEach(movies, function(movie) {

            var title = movie.string + '.strm';
            out += '<a href="' + encodeURIComponent(title) + '">' + title + '</a>\n';

        });

        out += '</pre><hr>';
        return out;
    }


};
