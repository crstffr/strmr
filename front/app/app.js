
require('promise.prototype.finally');

var angular = require('angular');

require('angular-ui-router');
require('ui-router-extras');
require('ocLazyLoad');

var AppController = require('./controller');

var setupNg = require('./setup/setupNg');
var setupRouter = require('./setup/router');
var setupOptionalSlash = require('./setup/optionalSlash');

var appName = 'strmr';

var appDeps = [
    'ui.router',
    'oc.lazyLoad',
    'ct.ui.router.extras',
    require('app/modules/location').name,
    require('app/common/forms/focus').name
];

module.exports = angular.module(appName, appDeps)
    .controller('AppController', AppController)
    .config(setupOptionalSlash)
    .config(setupRouter)
    .run(setupNg);
