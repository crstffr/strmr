/**
 * Set focus on elements with a directive and a broadcast service.
 *
 * In View:
 * <input type="email" name="user_email" focus-on="userEmail">
 *
 * In Controller:
 * angular.module('app').controller(['focusService', function(focusService) {
     *      focusService.setFocus('userEmail');
     * }]);
 */
var focus = angular.module('focus', []);

var eventName = 'setFocus';

var _ = require('lodash');

module.exports = focus;

/**
 * Directive used on form inputs to allow for programmatic focus.
 * Listens for a specific broadcast event, and if the broadcast
 * matches the attribute, set focus on the element.
 *
 * This also allows for focus on multiple events, which are
 * separated by a comma.  Example:
 *
 * <input focus-on="formReset,inputError">
 */
focus.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(eventName, function (e, name) {
            var parts = attr.focusOn.split(',');
            _.each(parts, function (part) {
                if (name === part) {

                    elem[0].focus();

                    // if text input field, then select
                    // the text when focusing (simulates
                    // same behavior when tabbing).

                    if (_.isFunction(elem[0].select)) {
                        elem[0].select();
                    }
                }
            });
        });
    };
});

/**
 * Service used to set focus on a input elements in your application
 * by triggering a specific broadcast event.
 *
 * Usage:
 * focusService.setFocus('formReset');
 *
 */
focus.service('focusService', function ($rootScope, $timeout) {
    return {
        setFocus: function (name, scope) {
            $timeout(function () {
                scope = scope || $rootScope;
                scope.$broadcast(eventName, name);
            });
        }
    };
});


