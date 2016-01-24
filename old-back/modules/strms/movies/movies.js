
var _ = require('lodash');
var fbref = require('../lib/firebase');
var current = require('../lib/current');
var User = require('../lib/user');
var HTML = require('../lib/html');

module.exports.handler = function(event, context) {

    var creds, user, movies, html;

    if (!event.u) {
        context.succeed({data: '<html><h1>No email specified</h1></html>'});
        return;
    }

    if (!event.p) {
        context.succeed({data: '<html><h1>No password specified</h1></html>'});
        return;
    }

    creds = {
        email: event.u,
        password: event.p
    };

    fbref.authWithPassword(creds, function(err, authData) {

        if (err) {

            context.succeed({data: '<html><h1>' + err +'</h1></html>'});

        } else {

            authData.creds = creds;

            current.user = new User(authData);

            current.user.movies.once('value', function(movies) {

                html = HTML('/movies/', movies);
                context.succeed({data: html});

            });
        }
    });

};
