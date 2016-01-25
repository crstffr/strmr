
var ng = require('ng');
var auth = require('strmr-common/auth');
var current = require('strmr-common/current');

module.exports = Login;

function Login() {

    return auth.withGithub().then(function(user) {
        return user;
    }).catch(function(err){
        console.warn(err);
    });

}
