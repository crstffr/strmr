
module.exports = require('angular')
    .module('route.auth.login', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'login/',
            name: 'auth.login',
            template: require('./auth.login.html!')
        });

}
