
require('./movie.min.css!');

var angular = require('angular');
var controller = require('./movie.ctrl');
var template = require('./movie.html!');

module.exports = angular
    .module('component.movie', [])
    .directive('posterError', function(){
        return {
            scope: {
                posterError: '&'
            },
            restrict: 'A',
            link: function(scope, element) {
                element.bind('error', function () {
                    scope.posterError();
                });
            }
        };
    })
    .directive('movie', function () {
        return {
            scope: {
                magnet: '=?',
                title: '=?',
                year: '=?'
            },
            restrict: 'E',
            template: template,
            controller: controller,
            controllerAs: 'movie',
            bindToController: true
        };
    }).name;
