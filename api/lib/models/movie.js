module.exports = Movie;

var _ = require('lodash');
var Promise = require('promise');
var idUtil = require('../utils/id');
var moviesRef = require('../data/movies');

function Movie(str1, str2) {

    var _this = this;

    this.id = '';
    this.year = '';
    this.title = '';
    this.imdbID = '';
    this.details = {};
    this.posters = [];
    this.queryString = '';

    str1 = str1 || '';

    // Check to see if this was instantiated with an ID
    // or with a title/year combination. If it's an ID,
    // then break it into the title/year.

    if (idUtil.test(str1)) {

        var idObj = idUtil.break(str1);
        this.title = idObj.title;
        this.year = idObj.year;

    } else {

        this.title = str1 || '';
        this.year = str2 || '';

    }

    Object.defineProperties(this, {
        id: {
            get: function () {
                return idUtil.make(_this.title, _this.year);
            }
        },

        queryString: {
            get: function () {
                return _this.title + ' ' + _this.year;
            }
        },

        ref: {
            get: function () {
                return moviesRef.child(_this.id);
            }
        },

        details: {
            set: function(details) {
                _this.ref.child('details').set(details);
            }
        },

        posters: {
            set: function(posters) {
                _this.ref.child('posters').set(posters);
            }
        }
    });


    this.getStoredData = function () {
        return new Promise(function (resolve, reject) {
            _this.ref.once('value', function (snap) {
                var data = snap.val();
                if (data) { resolve(data); }
                else { reject(); }
            });
        });
    };


    /**
     *
     * @returns {Promise}
     */
    this.getDetails = function() {
        return new Promise(function(resolve, reject) {
            _this.getStoredData().then(function(data) {
                if (data.details) {
                    resolve(data.details);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    };


    this.getPosters = function() {
        return new Promise(function(resolve, reject) {
            _this.getStoredData().then(function(data) {
                if (data.posters) {
                    resolve(data.posters);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    }

}



