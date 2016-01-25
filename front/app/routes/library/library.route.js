
module.exports = require('angular')
    .module('route.library', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'library/',
            name: 'app.library',
            template: '<div ui-view class="library.route"/>',
            redirect: '/library/home/',
            loggedIn: true
        })
        .state({
            url: 'home/',
            name: 'app.library.home',
            template: require('./home/library.home.html!'),
            loggedIn: true
        });

}
