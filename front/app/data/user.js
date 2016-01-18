var _ = require('lodash');
var fbref = require('app/firebase/ref');
var users = require('app/data/users');

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

        ref: {
            get: function () {
                return users.child(_this.auth.uid);
            }
        }

    });


}
