var Promise = require('promise');
var angular = require('angular');
var auth = require('strmr-common/auth');

module.exports = new Ng();

function Ng() {

    var _this = this;
    var _user;
    var _$rootScope;

    var _userReady = function(){};
    var _varsReady = function(){};
    var _ready = function(){};

    this.$state = {};
    this.$timeout = {};

    Object.defineProperties(this, {
        $rootScope: {
            get: function() {
                return _$rootScope || {};
            },
            set: function(val) {
                _$rootScope = val;
                _varsReady();
            }
        }
    });

    this.ready = function() {
        return Promise.all([userReady, varsReady]).then(function(){
            return _user;
        });
    };

    var varsReady = new Promise(function(resolve) {
        _varsReady = resolve;
    });

    var userReady = new Promise(function(resolve) {
        _userReady = resolve;
    });

    auth.onAuth(function(user) {
        varsReady.then(function() {
            _$rootScope.user = _user = user;
            _userReady();
            _this.digest();
        });
    });

    auth.onUnAuth(function() {
        varsReady.then(function() {
            _$rootScope.user = _user = null;
            _userReady();
            _this.digest();
        });
    });

    this.digest = function(fn) {
        fn = (typeof fn === 'function') ? fn : function(){};
        _this.ready().then(function(user) {
            fn(user);
            _this.$rootScope.$applyAsync();
            _this.$timeout(function(){
                _this.$rootScope.$digest();
            });
        });
    };

    /*
    this.Controller = function(fn, deps) {
        fn.$inject = deps || [];
        return fn;
    };

    this.Module = function(opts) {
        return angular.module('', [])
    };
    */

}
