module.exports = AppController;

var ng = require('ng');
var current = require('strmr-common/current');

AppController.$inject = [
    '$timeout',
    '$location',
    '$rootScope',
    'location'
];

function AppController($timeout,
                       $location,
                       $rootScope,
                       location) {

    // This is a replacement for the redirectTo feature of webui-core.
    // The redirecTo property doesn't work with future states, but this does.

    $rootScope.$on('$stateChangeStart', function (event, toState) {

        if (toState.redirect) {
            event.preventDefault();
            $timeout(function(){
                $location.path(toState.redirect);
                $rootScope.$apply();
            });
        }

        if (toState.loggedIn) {
            ng.ready().then(function(user){
                if (!user) {
                    event.preventDefault();
                    location.go('/auth/login/');
                }
            });
        }
    });

    // Attach the current objects to the rootscope. because i'm lazy.

    $rootScope.current = current;

    // If there's a magnet link coming in, save it for use after login.

    current.magnet = $location.search().uri;

    // When the user is ready, save it in the current service.

    ng.ready().then(function(user){
        current.user = user;
    });

    // Tie the LazyRouter events to our loader component so that when
    // the user is waiting on a route to load, we show a spinner.

    $rootScope.$on('lazyRouter.loading', function () {

    });

    $rootScope.$on('lazyRouter.loaded', function () {

    });

}
