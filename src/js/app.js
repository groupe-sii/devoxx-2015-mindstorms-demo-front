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
    'devoxx-2015-mindstorms-demo-front-services'
])
/**
 * @ngdoc controller
 * @name devoxx-2015-mindstorms-demo-front.controller:homeCtrl
 * @description
 * A description of the controller
 */
.controller('homeCtrl', ['$scope', 'appSocketFactory', 'MotorService', 'DataFactory', function($scope, appSocketFactory, MotorService, DataFactory) {

    /**
     * Sensors stuff
     */

    var CORRECT_MESSAGE = 'Correct !',
        INCORRECT_MESSAGE = 'Incorrect dude !',
        MIN_WIN = 3;

    $scope.answered = false;
    $scope.answerResult = false;

    appSocketFactory.forward('sensorValue', $scope);

    $scope.$on('socket:sensorValue', function(ev, data) {
        $scope.sensorValues = data;

        if (data.sensor1 === 1 || data.sensor2 === 1) {
            $scope.answered = true;

            if ((data.sensor1 === 1 && $scope.question.answers[0].correct) || (data.sensor2 === 1 && $scope.question.answers[1].correct)) {
                $scope.result = CORRECT_MESSAGE;
                $scope.answerResult = true;
                $scope.score += 1;
            } else {
                $scope.result = INCORRECT_MESSAGE;
            }

            setTimeout(nextQuestion, 2000);
        }
    });

    $scope.startSensorListener = function() {
        appSocketFactory.emit('startReadingSensors', function() {
            console.log('startReadingSensors action readed by server');
        });
    };

    $scope.stopSensorListener = function() {
        appSocketFactory.emit('stopReadingSensors', function() {
            console.log('stopReadingSensors action readed by server');
        });
    };

    /**
     * Motor stuff
     */

    $scope.startMotor = function() {
        MotorService.startMotor().then(function() {
            console.log('motor started');
        });
    };

    /**
     * Quiz stuff
     */

    var questions = null,
        nextQuestion = function() {
            $scope.questionIndex += 1;
            $scope.answered = $scope.answerResult = false;
            if ($scope.questionIndex > questions.length) {
                finishTest();
                $scope.finished = true;
                return;
            }
            $scope.question = questions[$scope.questionIndex - 1];
            $scope.result = '';
        },
        finishTest = function() {
            console.log('finishTest');
            if ($scope.score >= MIN_WIN) {
                $scope.startMotor();
            }
        };

    $scope.startTest = function() {
        $scope.testStarted = true;
        $scope.finished = false;
        $scope.questionIndex = 1;
        $scope.score = 0;

        questions = DataFactory.get();
        $scope.question = questions[$scope.questionIndex - 1];

        $scope.startSensorListener();
    };

}]);
