
var cleankey = require('app/utils/cleankey');
var current = require('app/common/current');

module.exports = Strm;

function Strm(magnet) {

    var _this = this;
    var _magnet = magnet;

    Object.defineProperties(this, {

        ref: {
            get: function() {
                return current.user.ref.child(cleankey(_magnet.firekey));
            }
        },

        magnet: {
            get: function() {
                return _magnet;
            }
        },

        contents: {
            get: function() {
                return new Promise(function(resolve) {
                    _this.ref.on('value', function(snapshot) {
                        resolve(snapshot.val());
                    });
                });
            },
            set: function(val) {
                if (!val) { return; }
                _this.ref.set(val);
            }
        }

    });

    _this.contents = _magnet;

}
