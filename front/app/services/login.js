var auth = require('strmr-common/auth');

module.exports = Login;

function Login() {

    return auth.withGithub().then(function(user) {
        return user;
    }).catch(function(err){
        console.warn(err);
    });

}
