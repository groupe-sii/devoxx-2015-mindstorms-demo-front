'use strict';

/**
 * @ngdoc factory
 * @name devoxx-2015-mindstorms-demo-front.factory:DataFactory
 * @description
 * A description of the DataFactory
 */
angular.module('devoxx-2015-mindstorms-demo-front')
    .factory('DataFactory', ['$q', 'DataService',
        function($q, DataService) {

            var DataFactory = {};

            DataFactory.data = [];

            DataService.get().then(function(data) {
                DataFactory.data = data.questions;
            });

            /* Privates fx */

            /* Public fx */

            DataFactory.get = function() {
                return DataFactory.data;
            };

            return DataFactory;

        }
    ]);
