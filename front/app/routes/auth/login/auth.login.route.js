
require('./auth.login.min.css!');

module.exports = require('angular')
    .module('route.auth.login', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'login/',
            name: 'app.auth.login',
            template: require('./auth.login.html!'),
            controller: require('./auth.login.ctrl'),
            controllerAs: 'ctrl'
        });

}
