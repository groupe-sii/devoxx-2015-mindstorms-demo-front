'use strict';

/**
 * @ngdoc factory
 * @name devoxx-2015-mindstorms-demo-front.factory:socketFactory
 * @description
 * A description of the socketFactory
 */
angular.module('devoxx-2015-mindstorms-demo-front')
    .factory('appSocketFactory', ['socketFactory', 'ev3IP', function(socketFactory, ev3IP) {
        return socketFactory({
            ioSocket: io.connect('http://' + ev3IP.ip + ':3000')
        });
    }]);
