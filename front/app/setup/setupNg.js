var ng = require('ng');

module.exports = SetupNg;

SetupNg.$inject = [
    '$state',
    '$timeout',
    '$rootScope',
    'location',
    '$stateParams'
];

function SetupNg($state, $timeout, $rootScope, location, $stateParams) {

    ng.$rootScope = $rootScope;
    ng.location = location;
    ng.$timout = $timeout;
    ng.$state = $state;
    ng.$stateParams = $stateParams;

}
