
var ng = require('ng');
var auth = require('strmr-common/auth');
var login = require('app/services/login');
var current = require('strmr-common/current');

module.exports = Controller;

function Controller() {

    this.login = login;

    auth.onAuth(function() {
        if (current.magnet) {
            ng.location.go('/magnet/');
        } else {
            ng.location.go('/library/home/');
        }
    });

    auth.onUnAuth(function(){
        ng.location.go('/auth/login/');
    });

}
