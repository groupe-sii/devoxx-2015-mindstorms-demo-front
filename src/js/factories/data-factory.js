'use strict';

/*globals _ */

/**
 * @ngdoc factory
 * @name devoxx-2015-mindstorms-demo-front.factory:DataFactory
 * @description
 * A description of the DataFactory
 */
angular.module('devoxx-2015-mindstorms-demo-front')
    .factory('DataFactory', ['$q', 'DataService',
        function($q, DataService) {

            var DataFactory = {},
                NUM_QUESTIONS = 5;

            DataFactory.data = [];

            DataService.get().then(function(data) {
                DataFactory.data = data.questions;
            });

            /* Privates fx */

            var createQuestionsArrayRandomly = function() {
                var _arr = [],
                    _proxyData = _.clone(DataFactory.data),
                    i = 0;

                for (i; i < NUM_QUESTIONS; i++) {
                    _proxyData = _.shuffle(_proxyData);
                    _arr.push(_proxyData.splice(0, 1)[0]);
                }

                return _arr;
            };

            /* Public fx */

            DataFactory.get = function() {
                return createQuestionsArrayRandomly();
            };

            return DataFactory;

        }
    ]);
