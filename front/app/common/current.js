
var User = require('app/data/user');

module.exports = new Current();

function Current() {

    var _user;

    Object.defineProperties(this, {
        user: {
            get: function(){
                return _user;
            },
            set: function(val){
                if (val instanceof User || val === null) {
                    _user = val;
                }
            }
        }
    });
}
