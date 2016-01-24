
var _ = require('lodash');

module.exports = {

    make: function(title, year) {

        return _.kebabCase(title + ' ' + year);

    },

    break: function(id) {

        var str = '';
        str = id.replace(/-/g, ' ');
        str = _.startCase(str);

        var year = str.substr(-4, 4);
        var title = str.slice(0, -5);

        return {
            title: title,
            year: year
        };

    },

    /**
     * Test to see if a string is a movie id
     * @param str
     * @returns {boolean}
     */
    test: function(str) {

        var hasWhites = Boolean((str.match(/ /g) || []).length > 0);
        var hasKebabs = Boolean((str.match(/-/g) || []).length > 0);
        var hasYear = Boolean((str.match(/\d+$/) || []).length > 0);

        return (!hasWhites && hasKebabs && hasYear);

    }

};

