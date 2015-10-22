module.exports = {

    ok: function(msg) {
        msg = Array.prototype.join.call(arguments, ' ');
        return JSON.stringify({ok: {msg: msg}});
    },

    data: function(data) {
        return JSON.stringify({ok: {data: data}});
    },

    error: function(msg) {
        msg = Array.prototype.join.call(arguments, ' ');
        return JSON.stringify({error: {msg: msg}});
    }

};
