
var ng = require('ng');
var auth = require('strmr-common/auth');
var login = require('app/services/login');

module.exports = Controller;

function Controller() {

    this.login = login;

    auth.onAuth(function(user) {
        ng.location.go('/library/home/');
    });

    auth.onUnAuth(function(){
        ng.location.go('/auth/login/');
    })

}
