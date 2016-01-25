module.exports = AppController;

var ng = require('ng');

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
            ng.ready().then(function(){
                if (!$rootScope.user) {
                    event.preventDefault();
                    location.go('/auth/login/');
                }
            });
        }
    });

    // Tie the LazyRouter events to our loader component so that when
    // the user is waiting on a route to load, we show a spinner.

    $rootScope.$on('lazyRouter.loading', function () {

    });

    $rootScope.$on('lazyRouter.loaded', function () {

    });

}
