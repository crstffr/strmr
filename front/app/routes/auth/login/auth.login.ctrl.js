
var ng = require('ng');
var auth = require('strmr-common/auth');
var login = require('app/services/login');

module.exports = Controller;

function Controller() {

    this.login = login;

    auth.onChange(function(user) {
        if (user) {
            ng.location.go('/library/home/');
        }
    });

}
