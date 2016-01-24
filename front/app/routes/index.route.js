
module.exports = require('angular')
    .module('route.index', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: '/',
            name: 'index',
            redirectTo: 'auth.login'
        });

}
