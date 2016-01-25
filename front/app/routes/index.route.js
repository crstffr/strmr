module.exports = require('angular')
    .module('route.index', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: '/',
            name: 'app',
            template: require('./index.layout.html!'),
            controller: require('./index.ctrl'),
            controllerAs: 'ctrl'
        });

}
