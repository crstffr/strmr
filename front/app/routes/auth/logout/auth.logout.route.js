
module.exports = require('angular')
    .module('route.auth.logout', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'logout/',
            name: 'app.auth.logout',
            template: require('./auth.logout.html!')
        });

}
