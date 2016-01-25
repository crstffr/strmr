var ng = require('ng');

module.exports = SetupNg;

SetupNg.$inject = [
    '$state',
    '$timeout',
    '$rootScope',
    'location'
];

function SetupNg($state, $timeout, $rootScope, location) {

    ng.$rootScope = $rootScope;
    ng.location = location;
    ng.$timout = $timeout;
    ng.$state = $state;

}
