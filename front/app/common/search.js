
var settings = require('app/settings');
var request = require('app/common/request');

module.exports = {

    posters: function() {

        var args = Array.prototype.slice.call(arguments);
        var url = settings.searchURL + 'posters/?q=' + args.join(' ');
        return request.get(url).then(function(resp){

            return resp.body;

        });

    },

    titles: function(title, year) {

        var url = settings.searchURL + 'title/?t=' + title + '&y=' + year;
        return request.get(url).then(function(resp){

            return resp.body;

        });

    }

};
