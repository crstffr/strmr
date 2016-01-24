
module.exports = require('angular')
    .module('route.auth', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: '/auth/',
            name: 'auth',
            template: '<ui-view/>'
        });

}
