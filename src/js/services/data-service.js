'use strict';

/**
 * @ngdoc service
 * @name devoxx-2015-mindstorms-demo-front-services.service:DataService
 * @description
 * A description of the DataService
 */
angular.module('devoxx-2015-mindstorms-demo-front-services').service('DataService', ['$resource', '$q',
    function($resource, $q) {

        var dataService = $resource('data/data.json', {}, {});

        this.get = function() {
            var d = $q.defer();

            dataService.get({}, {}, function(data) {
                d.resolve(data);
            }, function(p) {
                d.reject(p.status);
            });

            return d.promise;
        };
    }
]);
