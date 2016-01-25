
module.exports = LazyRouter;

LazyRouter.$inject = [
    '$urlRouterProvider',
    '$futureStateProvider'
];

/**
 * Register our future StateFactory with the futureStateProvider.  When a future state
 * is loaded, it will trigger the futureStateFactory.  Loop over each of our defined
 * future states and register them with the provider.
 *
 * @param $urlRouterProvider
 * @param $futureStateProvider
 * @constructor
 */
function LazyRouter($urlRouterProvider, $futureStateProvider) {

    if (typeof System === 'undefined') {
        throw new Error('Unable to instantiate LazyRouter, SystemJS not found');
    }

    $futureStateProvider.stateFactory('lazyroute', StateFactory);

    require('../futureStates').forEach(function (state) {
        $futureStateProvider.futureState(state);
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        // $injector.get('$state').go('error.404');
        console.warn('unable to transition to state', $location);
    });

}

StateFactory.$inject = [
    '$q',
    '$timeout',
    '$rootScope',
    '$ocLazyLoad',
    'futureState'
];

/**
 * Our StateFactory ties the ui-router-extras Future States feature, with the lazy
 * loading features of ocLazyLoad, and dependency injection features of SystemJS.
 *
 * @param $q
 * @param $timeout
 * @param $rootScope
 * @param $ocLazyLoad
 * @param futureState
 * @returns {Promise}
 * @constructor
 */
function StateFactory($q, $timeout, $rootScope, $ocLazyLoad, futureState) {

    var delay = 0;
    var mintime = 300; // in ms
    var start = Date.now();

    return $q(function (resolve, reject) {

        $rootScope.$emit('lazyRouter.loading', futureState);

        System.import(futureState.src).then(function (newModule) {

            $ocLazyLoad.load(newModule).then(function () {

                // If a futreState is defined with a delay boolean, then we should
                // make sure we wait the minimum time before resolving this load.

                delay = (futureState.delay) ? mintime - (Date.now() - start) : 0;

                $timeout(function () {

                    $rootScope.$emit('lazyRouter.loaded', futureState);
                    resolve();

                }, delay);

            }, function (err) {
                reject(err);
            });

        });

    });

}
