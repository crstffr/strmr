module.exports = {

    ok: function(msg) {
        return JSON.stringify({ok: {msg: msg}});
    },

    data: function(data) {
        return JSON.stringify({ok: {data: data}});
    },

    error: function(msg) {
        return JSON.stringify({error: {msg: msg}});
    }

};
