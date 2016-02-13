

module.exports = require('angular')
    .module('route.magnet', [
        require('app/components/movie/movie.module')
    ])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'magnet/',
            name: 'app.magnet',
            template: require('./magnet.html!'),
            controller: require('./magnet.ctrl'),
            controllerAs: 'ctrl',
            loggedIn: true
        });

}
