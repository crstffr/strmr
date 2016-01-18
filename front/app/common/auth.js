var _ = require('lodash');
var rpg = require('rpg');
var fbref = require('app/firebase/ref');
var settings = require('app/settings');
var current = require('app/common/current');
var User = require('app/data/user');

require('promise.prototype.finally');

module.exports = new Auth();

function Auth() {

    var _this = this;

    this.data = {};
    this.busy = false;
    this.loggedIn = false;
    this.validUser = false;
    this.validGithubUser = false;

    Object.defineProperties(this, {
        data: {
            get: function () {
                return fbref.getAuth();
            }
        },
        loggedIn: {
            get: function () {
                return !_this.busy && !_.isEmpty(_this.data);
            }
        },
        validUser: {
            get: function () {
                return !_this.busy && _this.loggedIn && _this.data.provider === 'password';
            }
        },
        validGithubUser: {
            get: function() {
                var user = _.get(_this.data, 'github.username');
                return Boolean(_.indexOf(settings.validUsers, user) >= 0);
            }
        }
    });

    fbref.onAuth(function (authData) {
        if (_this.validUser) {
            console.log('on auth change', authData);
            current.user = new User(authData);
        } else {
            current.user = null;
        }
    });

    /**
     *
     */
    this.logout = function () {
        fbref.unauth();
    };

    /**
     *
     * @returns {*}
     */
    this.login = function() {

        _this.busy = true;

        return _loginWithGithub().catch(function(err){
            console.error('Error logging in', err);
        }).finally(function(){
            _this.busy = false;
        });

    };

    /**
     *
     */
    this.onChange = function (fn) {
        fbref.onAuth(function(){
            fn(current.user);
        });
    };


    /**
     *
     * @returns {Promise}
     */
    function _loginWithGithub() {

        return new Promise(function(resolve, reject) {

            fbref.authWithOAuthPopup("github", function (error, authData) {

                if (error) {

                    reject(error);

                } else {

                    if (_this.validGithubUser) {
                        _loginWithUserPass(authData).then(resolve).catch(reject);
                    } else {
                        reject('You are logged in, but do not have access to this app');
                    }
                }
            });
        });
    }


    /**
     *
     * @param authData
     * @returns {Promise}
     * @private
     */
    function _loginWithUserPass(authData) {

        return new Promise(function(resolve, reject){

            _getUserPass(authData).then(function(userData){

                fbref.authWithPassword({
                    email: userData.email,
                    password: userData.password

                }, function(err, data) {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });

            }).catch(function(err){

                console.error(err);

            });
        });
    }

    /**
     *
     * @param authData
     * @returns {Promise}
     * @private
     */
    function _getUserPass(authData) {

        return new Promise(function(resolve, reject){

            fbref.child('auth').child(authData.uid).once('value', function(snap) {

               if (snap.hasChild('email') && snap.hasChild('password')) {

                    resolve(snap.val());

               } else {

                    _convertToUserPass(authData).then(resolve).catch(reject);

               }
            });
        });
    }

    /**
     *
     * @param authData
     * @returns {Promise}
     * @private
     */
    function _convertToUserPass(authData) {

        return new Promise(function (resolve, reject) {

            var settings = {
                email: _.kebabCase(authData.uid) + '@strmr.space',
                password: rpg({length: 30, set: 'lud'})
            };

            fbref.createUser(settings, function (err, data) {

                if (err) {

                    reject(err);

                } else {

                    settings = _.assign(data, settings);
                    _saveUserPass(authData.uid, settings);
                    resolve(settings);
                }
            });

        });
    }

    /**
     *
     * @param uid
     * @param settings
     * @private
     */
    function _saveUserPass(uid, settings) {

        fbref.child('auth').child(uid).set(settings);

    }


}
