
var ng = require('ng');

module.exports = require('angular')
    .module('route.library', [
        require('app/components/movie'),
        require('app/components/poster')
    ])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'library/',
            title: 'Library',
            name: 'app.library',
            template: '<div ui-view ng-if="user" class="library.route"/>',
            redirect: '/library/movies/',
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
        })
        .state({
            url: 'movies/',
            title: 'Movies',
            name: 'app.library.movies',
            template: require('./movies/library.movies.html!'),
            controller: require('./movies/library.movies.ctrl'),
            controllerAs: 'ctrl',
            loggedIn: true
        })
        .state({
            url: 'movie/{id}/',
            name: 'app.library.movie',
            template: require('./movie/library.movie.html!'),
            controller: require('./movie/library.movie.ctrl'),
            controllerAs: 'ctrl',
            loggedIn: true
        });

}
