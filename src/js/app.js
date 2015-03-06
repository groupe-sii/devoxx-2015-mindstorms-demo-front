'use strict';

/* globals angular */

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
    'ev3Config'
])
/**
 * @ngdoc factory
 * @name devoxx-2015-mindstorms-demo-front.factory:socketFactory
 * @description
 * A description of the socketFactory
 */
.factory('appSocketFactory', ['socketFactory', 'ev3IP', function(socketFactory, ev3IP) {
    return socketFactory({
        ioSocket: io.connect('http://' + ev3IP.ip + ':3000')
    });
}])
/**
 * @ngdoc controller
 * @name devoxx-2015-mindstorms-demo-front.controller:homeCtrl
 * @description
 * A description of the controller
 */
.controller('homeCtrl', ['$scope', 'appSocketFactory', function($scope, appSocketFactory) {
    appSocketFactory.forward('sensorValue', $scope);

    $scope.startSensorListener = function() {
        appSocketFactory.emit('startReadingSensors', function() {
            console.log('message readed by server');
        });
    };

    $scope.stopSensorListener = function() {
        appSocketFactory.emit('stopReadingSensors', function() {
            console.log('message readed by server');
        });
    };

    $scope.$on('socket:sensorValue', function(ev, data) {
        $scope.sensorValues = data;
    });
}]);
