'use strict';

/**
 * @ngdoc object
 * @name  qos-rcbi
 * @description
 *
 * Main module
 */
angular.module('devoxx-2015-mindstorms-demo-front', [
	'ngResource',
    'btford.socket-io',
    'templates',
    'ev3Config',
    'angular-progress-arc',
    'devoxx-2015-mindstorms-demo-front-services'
])
.config(['progressArcDefaultsProvider', function(progressArcDefaultsProvider) {
    progressArcDefaultsProvider
        .setDefault('stroke', '#0059a2')
        .setDefault('size', 40);
}]);
