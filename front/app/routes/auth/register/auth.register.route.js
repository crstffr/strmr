
module.exports = require('angular')
    .module('route.auth.register', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'register/',
            name: 'app.auth.register',
            template: require('./auth.register.html!')
        });

}
