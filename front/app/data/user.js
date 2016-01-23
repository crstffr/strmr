var _ = require('lodash');
var fbref = require('app/firebase/ref');
var users = require('app/data/users');
var store = require('store');

module.exports = User;

function User(authData) {

    var _this = this;
    var _key = 'creds';
    var _data = authData;

    Object.defineProperties(this, {

        auth: {
            get: function () {
                return _data;
            }
        },

        creds: {
            get: function() {
                return store.get(_key) || {};
            },
            set: function(val) {
                if (!val) {
                    store.remove(_key);
                } else {
                    store.set(_key, val);
                }
            }
        },

        email: {
            get: function() {
                return _this.creds.email || '';
            }
        },

        token: {
            get: function() {
                return _this.creds.token || '';
            }
        },

        ref: {
            get: function () {
                return users.child(_this.auth.uid);
            }
        }

    });


}
