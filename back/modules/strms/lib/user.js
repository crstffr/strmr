
var fbref = require('./firebase');

module.exports = User;

function User(authData) {

    var _this = this;
    var _data = authData;

    Object.defineProperties(this, {

        auth: {
            get: function () {
                return _data;
            }
        },

        authString: {
            get: function() {
                return '?u=' + _this.auth.creds.email + '&p=' + _this.auth.creds.password;
            }
        },

        ref: {
            get: function () {
                return fbref.child('users').child(_this.auth.uid);
            }
        },

        movies: {
            get: function() {
                return _this.ref.child('movies');
            }
        }

    });


}
