var Promise = require('promise');
var auth = require('strmr-common/auth');

module.exports = new Ng();

function Ng() {

    var _this = this;
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

    var userReady = new Promise(function(resolve) {
        _userReady = resolve;
    });

    var varsReady = new Promise(function(resolve) {
        _varsReady = resolve;
    });

    this.ready = function() {
        return Promise.all([userReady, varsReady]).then(function(){
            return _$rootScope.user;
        });
    };

    this.digest = function() {
        _this.ready().then(function() {
            _this.$rootScope.$applyAsync();
            _this.$timeout(function(){
                _this.$rootScope.$digest();
            });
        });
    };

    auth.onChange(function(user) {
        varsReady.then(function() {
            _$rootScope.user = user;
            _userReady();
            _this.digest();
        });
    });

}
