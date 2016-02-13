
module.exports = require('angular')
    .module('route.library', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'library/',
            title: 'Library',
            name: 'app.library',
            template: '<div ui-view ng-if="user" class="library.route"/>',
            redirect: '/library/home/',
            loggedIn: true
        })
        .state({
            url: 'home/',
            title: 'Library',
            name: 'app.library.home',
            template: require('./home/library.home.html!'),
            controller: require('./home/library.home.ctrl'),
            controllerAs: 'ctrl',
            loggedIn: true
        });

}
