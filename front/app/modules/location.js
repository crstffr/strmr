
module.exports = require('angular')
    .module('module.location', [])
    .service('location', Location);

Location.$inject = ['$timeout', '$rootScope', '$location'];

/**
 * This service is a replacement for when $state.go() doesn't
 * work due to FutureStates. It uses the normal $location.path()
 * to trigger the state change, which FutureStates will pick up.
 *
 * @constructor
 */
function Location($timeout, $rootScope, $location) {
    this.go = function(path) {
        $timeout(function () {
            $location.path(path);
            $rootScope.$apply();
        });
    };
}
