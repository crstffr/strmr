var ng = require('ng');
var auth = require('strmr-common/auth');
var login = require('app/services/login');

module.exports = IndexController;

IndexController.$inject = [];

function IndexController() {

    this.login = login;

    ng.ready().then(function(user) {


    });

}
