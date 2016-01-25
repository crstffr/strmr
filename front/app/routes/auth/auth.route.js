
module.exports = require('angular')
    .module('route.auth', [])
    .config(Route);

Route.$inject = ['$stateProvider'];

function Route($stateProvider) {

    $stateProvider
        .state({
            url: 'auth/',
            name: 'app.auth',
            template: '<div ui-view class="auth.route"/>',
            redirect: '/auth/login/'
        });

}
