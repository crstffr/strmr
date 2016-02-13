
require('promise.prototype.finally');

var angular = require('angular');

require('angular-ui-router');
require('ui-router-extras');
require('ocLazyLoad');

var appName = 'strmr';

var appDeps = [
    'ui.router',
    'oc.lazyLoad',
    'ct.ui.router.extras',
    require('app/modules/location'),
    require('app/modules/focus')
];

module.exports = angular.module(appName, appDeps)
    .controller('AppController', require('./controller'))
    .config(require('./setup/optionalSlash'))
    .config(require('./setup/router'))
    .run(require('./setup/setupNg'));
