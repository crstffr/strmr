
var _ = require('lodash');
var ref = require('./ref');
var settings = require('./settings');
var auth = new Auth();

module.exports = auth;

function Auth() {

  var _this = this;

  this.valid = false;
  this.loggedIn = false;

  Object.defineProperties(this, {
    loggedIn: {
      get: function() {
        var authData = ref.getAuth();
        return Boolean(_.isEmpty(authData) === false);
      }
    },
    valid: {
      get: function() {
        if (!_this.loggedIn) { return false; }
        var user = _.get(ref.getAuth(), 'github.username');
        return Boolean(_.indexOf(settings.validUsers, user) >= 0);
      }
    }
  });

  /**
   *
   */
  this.adjust = function(authData) {
    if (authData) {
      if (_this.valid) {
        console.log('user is valid');
      } else {
        console.log('user is not valid');
      }
    }
  };

  /**
   *
   * @type {Firebase.onAuth}
     */
  this.onChange = function(fn) {
    ref.onAuth(fn);
  };

  /**
   *
   */
  this.login = function() {
    ref.authWithOAuthPopup("github", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {


      }
    });
  };

  /**
   *
   */
  this.logout = function() {
    ref.unauth();
  };

}
