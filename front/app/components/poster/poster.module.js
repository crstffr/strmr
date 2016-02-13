
require('./poster.min.css!');

var angular = require('angular');
var template = require('./poster.html!');
var controller = require('./poster.ctrl');

module.exports = angular
    .module('component.poster', [])
    .directive('poster', function () {
        return {
            scope: {
                movie: '=?'
            },
            restrict: 'E',
            template: template,
            controller: controller,
            controllerAs: 'poster',
            bindToController: true
        };
    }).name;
