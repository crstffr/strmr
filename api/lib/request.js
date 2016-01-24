
var Promise = require('promise');
var request = require('request').defaults({json: true});

module.exports = {

    get: function(opts) {
        return new Promise(function(resolve, reject){
            request.get(opts, function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    resolve(resp.body, resp);
                }
            });
        });
    },
    post: function(opts) {
        return new Promise(function(resolve, reject){
            request.post(opts, function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    resolve(resp.body, resp);
                }
            });
        });
    },
    put: function(opts) {
        return new Promise(function(resolve, reject){
            request.put(opts, function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    resolve(resp.body, resp);
                }
            });
        });
    },
    head: function(opts) {
        return new Promise(function(resolve, reject){
            request.head(opts, function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    resolve(resp.body, resp);
                }
            });
        });
    }

};
