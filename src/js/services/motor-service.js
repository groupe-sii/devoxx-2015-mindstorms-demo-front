'use strict';

/**
 * @ngdoc service
 * @name devoxx-2015-mindstorms-demo-front-services.service:MotorService
 * @description
 * A description of the MotorService
 */
angular.module('devoxx-2015-mindstorms-demo-front-services')
.service('MotorService', ['$http', '$q', 'ev3IP',
    function($http, $q, ev3IP) {

        this.startMotor = function() {
            var d = $q.defer();

            $http({method: 'put', url: 'http://' + ev3IP.ip + ':3000/api/v1/motor'}).
            success(function() {
                console.log('motor putted');
            }).
            error(function(data, status) {
                d.reject(status);
            });

            return d.promise;
        };
    }
]);
