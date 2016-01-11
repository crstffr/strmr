module.exports = {

    ok: function(msg) {
        msg = Array.prototype.join.call(arguments, ' ');
        return {ok: {msg: msg}};
    },

    data: function(data) {
        return {ok: {data: data}};
    },

    error: function(msg) {
        msg = Array.prototype.join.call(arguments, ' ');
        return {error: {msg: msg}};
    }

};
